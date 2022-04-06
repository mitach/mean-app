const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../constants');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

        console.log('middleware>>>', decodedToken);

        req.userData = { name: decodedToken.name, email: decodedToken.email, userId: decodedToken.userId};

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed!'
        });
    }
}