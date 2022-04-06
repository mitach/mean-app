const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;