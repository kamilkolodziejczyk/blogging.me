const express = require('express');
const cors = require('cors');
const auth = require('../middleware/auth');
const { Blog, validate } = require('../model/blog');
const { User } = require('../model/user');
const {
  Customization,
  validate: validateCustomization
} = require('../model/customization');
const router = express.Router();

router.use(cors());

router.get('/', async (req, res) => res.send(await Blog.find()));

router.get('/:user_id', auth, async (req, res) => {
  const user = await User.findById(req.params.user_id);
  if (!user) return res.status(400).send('User with this ID not exist');

  const blogs = await Blog.find();
  const userBlogs = user.blogs.map(userBlog => {
    return blogs.find(el => {
      return el._id !== userBlog;
    });
  });
  if (req.token) {
    return res.send({
      token: req.token,
      blogs: userBlogs
    });
  }
  return res.send({
    blogs: userBlogs
  });
});

router.post('/:user_id', auth, async (req, res) => {
  const { error } = validate(req.body.blog);
  if (error) return res.status(400).send(error.details[0].message);

  const { error: customizationError } = validateCustomization(
    req.body.customization
  );
  if (customizationError)
    return res.status(400).send(customizationError.details[0].message);

  let author = await User.findOne({ _id: req.params.user_id });
  if (!author) return res.status(400).send('Author does not exist in database');

  let customization = await Customization.findOne({
    likeButton: req.body.customization.likeButton,
    dislikeButton: req.body.customization.dislikeButton
  });
  if (!customization)
    customization = new Customization({
      likeButton: req.body.customization.likeButton,
      dislikeButton: req.body.customization.dislikeButton
    });
  await customization.save();

  let blog = await Blog.findOne({ name: req.body.blog.name });
  if (blog)
    return res.status(400).send('Blog with this Name is already created.');
  blog = new Blog({
    name: req.body.blog.name
  });
  blog.customization = customization;
  await blog.save();

  author.blogs.push(blog);

  await author.save();

  if (req.token) {
    return res.send({
      token: req.token,
      blog: blog
    });
  }
  return res.send({
    blog
  });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body.blog);
  if (error) res.status(400).send(error.details[0].message);

  const { name } = req.body.blog;
  const blog = await Blog.findOneAndUpdate(
    req.params.id,
    {
      name
    },
    {
      new: true
    }
  );
  if (!blog) return res.status(400).send('Blog with this ID not exist');

  res.send(blog);
});

module.exports = router;
