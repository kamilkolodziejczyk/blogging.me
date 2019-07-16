const express = require('express');
const cors = require('cors');
const auth = require('../middleware/auth');
const { Post, validate } = require('../model/post');
const { Blog } = require('../model/blog');
const router = express.Router();
router.use(cors());

router.get('/', async (req, res) => {
  res.send(await Post.find());
});

router.post('/:current_blog_id', auth, async (req, res) => {
  const { error } = validate(req.body.post);
  if (error) return res.status(400).send(error.details[0].message);

  let blog = await Blog.findById(req.params.current_blog_id);
  if (!blog) return res.status(404).send('Blog with this ID not exist.');

  const post = new Post({
    title: req.body.post.title,
    publishDate: req.body.post.publishDate,
    content: req.body.post.content
  });
  await post.save();

  blog.posts.push(post);
  await blog.save();

  if (req.token) {
    return res.send({
      token: req.token,
      post
    });
  }
  return res.send({
    post
  });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, publishDate, content } = req.body;

  const post = await Post.findOneAndUpdate(
    req.params.id,
    { title, publishDate, content },
    { new: true }
  );
  if (!post) return res.status(404).send('Post with this ID not exist');
  if (req.token) {
    return res.send({
      token: req.token,
      post
    });
  }
  return res.send({
    post
  });
});

router.delete('/:id', auth, async (req, res) => {
  let blogs = await Blog.find();
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post with this ID not exist');

  await blogs.map(blog => {
    blog.posts = blog.posts.filter(post_id => {
      post_id === post._id;
    });
    blog.save();
  });
  await post.remove();

  if (req.token) {
    return res.send({
      token: req.token,
      message: 'Success delete post'
    });
  }
  return res.send({ message: 'Success delete post' });
});

module.exports = router;
