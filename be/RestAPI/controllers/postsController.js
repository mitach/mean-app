const express = require('express');
const router = express.Router();

const Post = require('../models/Post');

router.get('', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: posts
            })
        })
});

router.post('', (req, res) => {

    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save()
        .then(createdPost => {
            res.status(200).json({
                message: 'Post added successfully!',
                createdPost
            });
        });
});

module.exports = router;
