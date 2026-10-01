const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'artist'],
    default: 'user'
  },
  isVerified: {
  type: Boolean,
  default: false
},
otpHash: {
  type: String,
  default: null
},
otpExpiresAt: {
  type: Date,
  default: null
}
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
