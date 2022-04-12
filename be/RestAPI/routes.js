const express = require('express');
const router = express.Router();

const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');
const postsController = require('./controllers/postsController');

router.use('/api/users', authController);
router.use('/api/blog', blogController);
router.use('/api/posts', postsController);

module.exports = router;