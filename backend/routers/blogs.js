const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {Blog, validate} = require('../model/blog');
const {User} = require('../model/user');
const {
  Customization,
  validate: validateCustomization
} = require('../model/customization');
const router = express.Router();

router.use(cors());

router.get('/', async (req, res) => res.send(await Blog.find()));

router.get('/:id', [auth, validateObjectId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send('User with this ID not exist');
  const blogs = await Blog.find();

  const userBlogs = [];

  user.blogs.map(userBlog => {
    blogs.map(blog => {
      if (mongoose.Types.ObjectId(userBlog).equals(blog._id)) {
        userBlogs.push(blog);
      }
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

router.post('/:id', [auth, validateObjectId], async (req, res) => {
  const {error} = validate(req.body.blog);
  if (error) return res.status(400).send(error.details[0].message);

  const {error: customizationError} = validateCustomization(
    req.body.customization
  );
  if (customizationError)
    return res.status(400).send(customizationError.details[0].message);

  let author = await User.findOne({_id: req.params.id});
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

  let blog = await Blog.findOne({name: req.body.blog.name});
  if (blog)
    return res.status(400).send('Blog with this name was already created.');
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

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const {error} = validate(req.body.blog);
  if (error) res.status(400).send(error.details[0].message);

  const {name} = req.body.blog;
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

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send('Blog with this ID not exist');

  const users = await User.find();
  await users.map(user => {
    user.blogs = user.blogs.filter(userBlog => {
      return !mongoose.Types.ObjectId(blog._id).equals(userBlog);
    });
    user.save();
  });
  await blog.remove();

  if (req.token) {
    return res.send({
      token: req.token,
      message: 'Success delete blog'
    });
  }
  return res.send({message: 'Success delete blog'});
});

module.exports = router;
