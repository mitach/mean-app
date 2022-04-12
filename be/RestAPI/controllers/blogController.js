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

module.exports = router;
