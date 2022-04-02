const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

function expressConfig(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({origin: 'http://localhost:4200'}));
    app.use(bodyParser.json());
}

module.exports = expressConfig;