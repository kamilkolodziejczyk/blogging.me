const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  publishDate: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  reactions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reaction'
  }
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = {
    title: Joi.string().min(3).max(255).required(),
    publishDate: Joi.date().required(),
    image: Joi.string().allow(['']),
    content: Joi.string().required()
  };
  return Joi.validate(post, schema);
}

module.exports.Post = Post;
module.exports.validate = validatePost;
