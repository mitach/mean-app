const express = require('express');
const multer = require('multer');

const router = express.Router();

const Post = require('../models/Post');

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
        cb(error, 'RestAPI/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get('', (req, res) => {
    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);
    const postQuery = Post.find();

    console.log('>>>', pageSize, currentPage);

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
});

router.post('', multer({ storage: storage }).single('image'), (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });

    post.save()
        .then(createdPost => {
            res.status(200).json({
                message: 'Post added successfully!',
                createdPost
            });
        });
});

router.put('/edit/:id', multer({ storage: storage }).single('image'), (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
    });

    Post.updateOne({ _id: req.params.id }, post)
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

router.delete('/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id })
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
})

module.exports = router;
