const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const notfoundRouter = express.Router();

notfoundRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, (req, res, next) => {
        res.render('notfound');
    });

module.exports = notfoundRouter;
