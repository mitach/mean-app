const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const avatarImage = require('../middlewares/avatar-image');

const { SALT_ROUNDS, JWT_SECRET_KEY } = require('../constants');

const router = express.Router();

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

router.post('/signup', avatarImage, (req, res) => {
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
                    if (err.errors.name) {
                        return res.status(500).json({
                            message: 'Please enter your name!'
                        });
                    } else if (err.errors.email) {
                        return res.status(500).json({
                            message: 'Email already taken!'
                        });
                    }
                    res.status(500).json({
                        message: 'Invalid credentials!' + err.errors.kind + ' - ' + err.errors.path
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
                    message: 'Invalid authentication credentials!'
                });
            }

            userReceived = user;

            bcrypt.compare(req.body.password, user.password)
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
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials!'
            });
        });
});

module.exports = router;