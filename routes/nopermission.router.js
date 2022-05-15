const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const noPermissionRouter = express.Router();

noPermissionRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, (req, res, next) => {
        res.render('noPermission');
    });

module.exports = noPermissionRouter;
