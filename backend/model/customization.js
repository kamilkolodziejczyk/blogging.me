const mongoose = require('mongoose');
const Joi = require('joi');

const customizationSchema = new mongoose.Schema({
  likeButton: {
    type: String,
    required: true
  },
  dislikeButton: {
    type: String,
    required: true
  }
});

const Customization = mongoose.model('Customization', customizationSchema);

function validateCustomization(customization) {
  const schema = {
    likeButton: Joi.string().required(),
    dislikeButton: Joi.string().required()
  };
  return Joi.validate(customization, schema);
}

module.exports.Customization = Customization;
module.exports.validate = validateCustomization;
