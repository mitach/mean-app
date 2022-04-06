const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { SALT_ROUNDS } = require('../constants');

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
    
})

module.exports = router;