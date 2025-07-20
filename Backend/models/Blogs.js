const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter blog title'],
    },
    author: {
        type: String,
        required: [true, 'Please enter auther name'],
    },
    description: {
        type: String,
        required: [true, 'Please enter blog description'],
    },
    image: {
        type: String,
        required: [true, 'Please upload blog image'],
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: [true, 'Please enter blog content'],
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('blog', blogSchema); 