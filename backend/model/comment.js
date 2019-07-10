const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
  const schema = {
    user_id: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required()
  };
  return Joi.validate(comment, schema);
}

module.exports.Comment = Comment;
module.exports.validate = validateComment;
