const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    
    title: {type: String, required: true},
    desc: {type: String, required: true},
    timestamp: {type: String, required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: {type: String, required: true},
    thumbnail: {type: String, required: true},
  },
  {
    collection: "posts",
  }
);
postSchema.index({
    'title': 'text',
    'desc': 'text',
    'author': 'text',
    "content": 'text',
})
module.exports = mongoose.model("Post", postSchema);
