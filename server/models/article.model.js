const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  writer: {
    type: String
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);