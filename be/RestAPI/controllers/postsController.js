const express = require('express');

const router = express.Router();

const Post = require('../models/Post');
const checkAuth = require('../middlewares/check-auth');
const postImage = require('../middlewares/post-image');
const User = require('../models/User');

router.get('', (req, res) => {
    let postQuery;

    if (req.query.keyword) {
        postQuery = Post.find({ content: new RegExp(req.query.keyword, 'i') });
    } else if (req.query.title) {
        postQuery = Post.find({ title: new RegExp(req.query.title, 'i') });
    } else {
        postQuery = Post.find();
    }

    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);

    let postsReceived;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }

    postQuery
        .then(posts => {
            postsReceived = posts;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: postsReceived,
                maxPosts: count
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed! '
            })
        })
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed! '
            })
        });
});

router.get('/by/:userId', (req, res) => {
    Post.find({ creator: req.params.userId })
        .then(posts => {
            if (posts) {
                res.status(200).json({
                    posts: posts
                })
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed! '
            })
        });
})

router.post('', checkAuth, postImage, async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    let creator = await User.findById(req.userData.userId);
    let creatorAvatar = await User.findById(req.userData.userId);

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/postimages/' + req.file.filename,
        creator: req.userData.userId,
        creatorName: creator.name,
        creatorAvatar: creatorAvatar.avatarPath
    });

    post.save()
        .then(createdPost => {
            res.status(200).json({
                message: 'Post added successfully!',
                createdPost
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating post failed!'
            })
        })
});

router.put('/edit/:id', checkAuth, postImage, (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/postimages/' + req.file.filename
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {

            if (result.modifiedCount > 0) {
                res.status(200).json({
                    message: 'Update successful!'
                });
            } else if (result.matchedCount == 0) {
                res.status(401).json({
                    message: 'Not Authorized!'
                });
            } else if (result.matchedCount == 1) {
                res.status(200).json({
                    message: 'Everything is the same!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update post!'
            })
        });
});

router.delete('/:id', checkAuth, (req, res) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
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
        .catch(error => {
            res.status(500).json({
                message: 'Deleting posts failed!'
            })
        }) 
});

module.exports = router;