const asyncHandle = require('./asyncHandle');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../common/ErrorResponse');

module.exports.admin = asyncHandle(async (req, res, next) => {
    const { id } = req.query;
    const user = await User.findById(id);
    console.log(user);
    if (user && user.role === 'admin') {
        next();
    } else {
        return next(new ErrorResponse('Not admin', 401));
    }
});

module.exports.protect = asyncHandle(async (req, res, next) => {
    if (req.headers.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
            if (err) next(new ErrorResponse('Invalid token'), 401);
            else next();
        });
    } else {
        return next(new ErrorResponse('Not authorized', 401));
    }
});
