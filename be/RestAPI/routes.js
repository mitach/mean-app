const express = require('express');
const router = express.Router();

const postsController = require('./controllers/postsController');

router.use('/posts', postsController);

module.exports = router;