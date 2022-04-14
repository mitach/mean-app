const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('../models/User');

const { SALT_ROUNDS, JWT_SECRET_KEY } = require('../constants');

const router = express.Router();

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
        cb(error, 'RestAPI/avatars');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get('', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: 'Users fetched successfully!',
                users: users
            });
        });
});

router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            res.status(200).json({
                message: 'User fetched successfully!',
                user: {
                    name: user.name,
                    email: user.email,
                    avatarPath: user.avatarPath
                }
            });
        });
});

router.post('/signup', multer({ storage: storage }).single('image'), (req, res) => {
    const url = req.protocol + '://' + req.get('host');


    bcrypt.hash(req.body.password, SALT_ROUNDS)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                avatarPath: url + '/avatars/' + req.file.filename,
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User Created!',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                });
        });
});

router.post('/login', (req, res) => {
    let userReceived;

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            }

            userReceived = user;

            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            }

            const token = jwt.sign(
                { name: userReceived.name, email: userReceived.email, userId: userReceived._id },
                JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: userReceived._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials!'
            });
        });
});

module.exports = router;