const express = require('express');
const multer = require('multer');

const router = express.Router();

const Blog = require('../models/Blog');
const checkAuth = require('../middlewares/check-auth');
const User = require('../models/User');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');

        if (isValid) {
            error = null;
        }
        cb(error, 'RestAPI/blog-images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

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
});


router.post('', checkAuth, multer({ storage: storage }).single('image'), async (req, res) => {
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
        });
});

router.put('/edit/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
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
            } else {
                res.status(401).json({
                    message: 'Not Authorized!'
                });
            }
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
        });
});

module.exports = router;
