const mongoose = require('mongoose');

const { DB_CONNECTION_STRING } = require('../constants');

exports.initDatabase = function () {
    return mongoose.connect(DB_CONNECTION_STRING);
}