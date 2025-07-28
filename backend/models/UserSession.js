const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  chatHistory: {
    type: Array, 
    default: [],
  },
  jsx: {
    type: String,
    default: "",
  },
  css: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model('UserSession', userSessionSchema);
