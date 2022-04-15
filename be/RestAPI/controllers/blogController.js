const express = require('express');

const router = express.Router();

const Blog = require('../models/Blog');
const checkAuth = require('../middlewares/check-auth');
const blogImage = require('../middlewares/blog-image');
const User = require('../models/User');

router.get('', (req, res) => {
    let postQuery = Blog.find();

    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);

    let blogsReceived;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }

    postQuery
        .then(blogs => {
            blogsReceived = blogs;
            return Blog.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                blog: blogsReceived,
                maxPosts: count
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching blogs failed! '
            })
        })
});

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (blog) {
                res.status(200).json(blog)
            } else {
                res.status(404).json({
                    message: 'Blog not found!'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching blog failed! '
            })
        })
});

router.get('/by/:userId', (req, res) => {
    Blog.find( { creator: req.params.userId})
    .then(blogs => {
        if (blogs) {
            res.status(200).json({
                blogs: blogs
            })
        } else {
            res.status(404).json({
                message: 'Blogs not found!'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching blog failed! '
        })
    })
});

router.post('', checkAuth, blogImage, async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    let creator = await User.findById(req.userData.userId);

    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/blogimages/' + req.file.filename,
        creator: req.userData.userId,
        creatorName: creator.name,
    });

    blog.save()
        .then(createdBlog => {
            res.status(200).json({
                message: 'Blog added successfully!',
                createdBlog
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating blogs failed! '
            })
        })
});

router.put('/edit/:id', checkAuth, blogImage, (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/blogimages/' + req.file.filename
    }

    const blog = new Blog({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

    Blog.updateOne({ _id: req.params.id, creator: req.userData.userId }, blog)
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
                res.status(401).json({
                    message: 'Edit not made, Everything is the same!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update blog! '
            })
        })
});

router.delete('/:id', checkAuth, (req, res) => {
    Blog.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
                message: 'Deleting blog failed!'
            })
        })
});

module.exports = router;
