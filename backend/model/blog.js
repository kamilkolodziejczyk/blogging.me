const mongoose = require('mongoose');
const Joi = require('joi');

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 3
  },
  customization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customization'
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

const Blog = mongoose.model('Blog', blogSchema);

function validateBlog(blog) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
  };
  return Joi.validate(blog, schema);
}

module.exports.Blog = Blog;
module.exports.validate = validateBlog;
