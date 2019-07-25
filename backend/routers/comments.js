const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('../middleware/auth');
const { Comment, validate } = require('../model/comment');
const { Post } = require('../model/post');
const { User } = require('../model/user');
const router = express.Router();
router.use(cors());

router.get('/', async (req, res) => {
  res.send(await Comment.find());
});

router.get('/:post_id', auth, async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) return res.status(404).send('Post with this ID not exist');

  const comments = await Comment.find();
  const users = await User.find();

  const postComments = [];

  post.comments.map(comment => {
    comments.map(c => {
      if (mongoose.Types.ObjectId(c._id).equals(comment)) {
        users.map(u => {
          if (mongoose.Types.ObjectId(u._id).equals(c.user_id)) {
            postComments.push({ comment: c, author: u });
          }
        });
      }
    });
  });

  postComments.sort(function(a, b) {
    return new Date(b.comment.date) - new Date(a.comment.date);
  });

  res.send(postComments);
});

router.post('/:current_post_id', auth, async (req, res) => {
  const { error } = validate(req.body.comment);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findOne({ _id: req.params.current_post_id });
  if (!post) return res.status(404).send('Post with this ID not exist.');

  const { user_id, content, date } = req.body.comment;
  const comment = new Comment({
    user_id,
    content,
    date
  });

  await comment.save();

  post.comments.push(comment);
  await post.save();

  if (req.token) {
    return res.send({
      token: req.token,
      comment
    });
  }
  return res.send({
    comment
  });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { user_id, content, date } = req.body;
  const comment = await Comment.findOneAndUpdate(
    req.params.id,
    { user_id, content, date },
    { new: true }
  );
  if (!comment)
    return res.status(404).send('Comment with this ID is not exist.');

  if (req.token) {
    return res.send({
      token: req.token,
      comment
    });
  }
  return res.send({
    comment
  });
});

router.delete('/:id', auth, async (req, res) => {
  let posts = await Post.find();
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).send('Comment with this ID not exist');

  await posts.map(post => {
    post.comments = post.comments.filter(comment_id => {
      comment_id === comment._id;
    });
    post.save();
  });
  await comment.remove();

  if (req.token) {
    return res.send({
      token: req.token,
      message: 'Success delete comment'
    });
  }
  return res.send({ message: 'Success delete comment' });
});

module.exports = router;
