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

router.delete('/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id})
        .then (result => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: 'Deletion successful!'
                })
            } else {
                res.status(401).json({ 
                    message: 'Not Authorized!'
                });
            }
        })
})

module.exports = router;
