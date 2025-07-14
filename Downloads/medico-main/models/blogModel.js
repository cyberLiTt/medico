// models/Blog.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String
    },
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
