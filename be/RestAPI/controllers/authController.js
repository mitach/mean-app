const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { SALT_ROUNDS, JWT_SECRET_KEY } = require('../constants');

const router = express.Router();

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, SALT_ROUNDS)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
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
                        error: err
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
            console.log(err);
        })
})

module.exports = router;