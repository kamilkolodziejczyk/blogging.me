const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const {User} = require('../model/user');
const router = express.Router();

router.use(cors());

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Invalid email');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  res.send({
    token: user.generateToken(),
    user
  });
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
