const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User, validate } = require('../model/user');
const { Blog } = require('../model/blog');
const router = express.Router();

router.use(cors());

router.get('/', auth, async (req, res) => {
  if (req.token) {
    return res.send({
      users: await User.find().sort('email'),
      token: req.token
    });
  }
  return res.send({ users: await User.find().sort('email') });
});

router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User with this ID not exist.');
  res.send(user);
});

router.get('/all-info/search/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User with this ID not exist.');
  const blogs = await Blog.find();
  const users = await User.find();
  const newBlogs = [];
  const newFollowers = [];
  await user.blogs.map(blog =>
    blogs.map(b => {
      if (mongoose.Types.ObjectId(b._id).equals(blog)) return newBlogs.push(b);
    })
  );
  await user.following.map(follower =>
    users.map(u => {
      if (mongoose.Types.ObjectId(u._id).equals(follower))
        return newFollowers.push(u);
    })
  );

  res.send({
    user,
    blogs: newBlogs,
    following: newFollowers
  });
});

router.get('/followers/:current_user_id', auth, async (req, res) => {
  const users = await User.find();
  const user = await User.findById(req.params.current_user_id);
  if (!user) return res.status(404).send('User with this ID not exist.');

  const following = user.following.map(follower => {
    return users.find(user =>
      mongoose.Types.ObjectId(user._id).equals(follower)
    );
  });

  return res.send(following);
});

router.get('/search/:current_user_id', async (req, res) => {
  const users = await User.find();
  const searchUsers = users.filter(
    user =>
      !mongoose.Types.ObjectId(user._id).equals(req.params.current_user_id)
  );

  res.send(searchUsers);
});

router.post('/register', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = new User(
    _.pick(req.body, ['email', 'password', 'firstName', 'lastName', 'avatar'])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.status(200).send({
    token: user.generateToken(),
    user
  });
});

router.post('/follow/:current_user_id', auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.params.current_user_id });
  if (!currentUser) return res.status(404).send('User with this ID not exist.');

  const followUser = await User.findOne({ email: req.body.email });
  if (!followUser)
    return res.status(404).send('User with this email not exist');

  currentUser.following.push(followUser._id);
  await currentUser.save();

  if (req.token) {
    return res.status(200).send({
      token: req.token,
      user: currentUser
    });
  }
  return res.send({ user: currentUser });
});

router.put('/unfollow/:current_user_id', auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.params.current_user_id });
  if (!currentUser) return res.status(404).send('User with this ID not exist.');

  currentUser.following = currentUser.following.filter(
    follower => !mongoose.Types.ObjectId(follower).equals(req.body.follower)
  );
  await currentUser.save();

  return res.send(currentUser);
});

router.put('/:id', async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const { email, firstName, lastName, avatar } = req.body;
  let user = await User.findById(req.params.id);
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.avatar = avatar;

  await user.save();
  res.send(user);
});

router.delete('/:id', async (req, res) => {
  res.send(await User.findByIdAndDelete(req.params.id));
});

function validateUpdateUser(user) {
  const schema = {
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    firstName: Joi.string()
      .min(5)
      .max(255)
      .required(),
    lastName: Joi.string()
      .min(5)
      .max(255)
      .required(),
    avatar: Joi.string()
  };
  return Joi.validate(user, schema);
}

module.exports = router;
