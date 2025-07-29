const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isGoogleUser: { type: String, required: false },
    googleId: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
