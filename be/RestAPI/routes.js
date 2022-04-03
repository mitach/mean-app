const express = require('express');
const router = express.Router();

const postsController = require('./controllers/postsController');

router.use('/api/posts', postsController);

module.exports = router;