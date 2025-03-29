const mongoose = require('mongoose');

// Create Post Schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

// Export Post Model
module.exports = mongoose.model('Post', postSchema);
