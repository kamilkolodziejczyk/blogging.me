const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User, validate } = require('../model/user');
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

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const { email, password, firstName, lastName, avatar } = req.body;
  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send('User with this ID not exist');
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  user = await User.findOneAndUpdate(
    req.params.id,
    {
      email,
      password: newPassword,
      firstName,
      lastName,
      avatar
    },
    {
      new: true
    }
  );

  res.send(user);
});

router.delete('/:id', async (req, res) => {
  res.send(await User.findByIdAndDelete(req.params.id));
});

module.exports = router;
