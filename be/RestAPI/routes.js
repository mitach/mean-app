const express = require('express');
const router = express.Router();

const postsController = require('./controllers/postsController');
const authController = require('./controllers/authController');

router.use('/api/posts', postsController);
router.use('/api/users', authController)

module.exports = router;