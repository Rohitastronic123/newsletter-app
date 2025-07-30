// models/Newsletter.js
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: { type: String, enum: ['free', 'premium'], default: 'free' }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
