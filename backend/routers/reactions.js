const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {Reaction} = require('../model/reaction');
const {Post} = require('../model/post');
const {User} = require('../model/user');
const router = express.Router();
router.use(cors());

router.get('/:id', [auth, validateObjectId], async (req, res) => {
  const reaction = await Reaction.findById(req.params.id);
  if (!reaction) return res.status(400).send('Reaction with this ID not exist');

  return res.send(reaction);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send('Post with this ID not exist.');

  const reaction = await Reaction.findById(post.reactions);
  if (!reaction)
    return res.status(400).send('Reaction with this ID not exist.');

  const user = await User.findById(req.body.user_id);
  if (!user) return res.status(400).send('User with this ID not exist.');

  if (req.body.reactionType === 'like') {
    if (
      !reaction.likes.find(like =>
        mongoose.Types.ObjectId(user._id).equals(like)
      )
    ) {
      reaction.likes.push(user._id);
      await reaction.save();
      if (
        reaction.dislikes.find(dislike =>
          mongoose.Types.ObjectId(user._id).equals(dislike)
        )
      ) {
        reaction.dislikes.pop(user._id);
        await reaction.save();
      }
    } else {
      return res.status(404).send('You already like this post.');
    }
  } else if (req.body.reactionType === 'dislike') {
    if (
      !reaction.dislikes.find(dislike =>
        mongoose.Types.ObjectId(user._id).equals(dislike)
      )
    ) {
      reaction.dislikes.push(user._id);
      await reaction.save();
      if (
        reaction.likes.find(like =>
          mongoose.Types.ObjectId(user._id).equals(like)
        )
      ) {
        reaction.likes.pop(user._id);
        await reaction.save();
      }
    } else {
      return res.status(404).send('You already dislike this post.');
    }
  }
  return res.send(reaction);
});

module.exports = router;
