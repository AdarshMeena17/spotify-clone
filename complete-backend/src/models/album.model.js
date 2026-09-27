const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String
  },
  coverFileId: {
    type: String
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }]
}, { timestamps: true });

module.exports = mongoose.models.Album || mongoose.model('Album', albumSchema);
