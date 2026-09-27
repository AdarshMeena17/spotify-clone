const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  audioFileId: {
    type: String
  },
  coverImage: {
    type: String
  },
  coverFileId: {
    type: String
  },
  duration: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.models.Music || mongoose.model('Music', musicSchema);
