const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports.Reaction = Reaction;
