const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

userSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    },
    config.get('jwtPrivateKey')
  );
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .required(),
    firstName: Joi.string()
      .min(5)
      .max(255)
      .required(),
    lastName: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
