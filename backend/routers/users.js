const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../model/user');
const router = express.Router();

router.use(cors());

router.get('/', async (req, res) => res.send(await User.find().sort('email')));

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User with this ID not exist.');
  res.send(user);
});

router.post('/register', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = new User(
    _.pick(req.body, ['email', 'password', 'firstName', 'lastName'])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.status(200).send({
    token: user.generateToken(),
    user
  });
});

module.exports = router;
