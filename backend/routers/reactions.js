const express = require('express');
const cors = require('cors');
const auth = require('../middleware/auth');
const { Reaction } = require('../model/reaction');
const { Post } = require('../model/post');
const { User } = require('../model/user');
const router = express.Router();
router.use(cors());

router.get('/:id', auth, async (req, res) => {
  const reaction = await Reaction.findById(req.params.id);
  if (!reaction) res.status(400).send('Reaction with this ID not exist');

  res.send(reaction);
});

router.put('/:post_id', auth, async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) return res.status(400).send('Post with this ID not exist.');

  console.log(post);
  const reaction = await Reaction.findById(post.reactions);
  if (!reaction)
    return res.status(400).send('Reaction with this ID not exist.');

  const user = await User.findById(req.body.user_id);
  if (!user) return res.status(400).send('User with this ID not exist.');

  if (req.body.reactionType === 'like') {
    reaction.likes.push(user._id);
    await reaction.save();
  } else {
    reaction.dislikes.push(user._id);
    await reaction.save();
  }
  return res.send(reaction);
});

module.exports = router;
