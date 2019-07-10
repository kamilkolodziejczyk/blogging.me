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

  let blog = await Blog.findOne({ _id: req.params.current_blog_id });
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
  return res.send(post);
});

module.exports = router;
