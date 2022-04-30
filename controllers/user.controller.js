const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

module.exports = {
    // [GET] /users/admin
    getAllUsers: asyncHandle(async (req, res, next) => {
        const users = await User.find();
        // res.status(200).json(users);
        res.render('users', { users });
    }),

    // [GET] /users/:id
    getUser: asyncHandle(async (req, res, next) => {
        let { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }),

    // [PUT] /users/:id
    updateUserById: asyncHandle(async (req, res, next) => {
        let { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        res.status(200).json(user);
    }),

    // [DELETE] /users/:id
    deleteUserById: asyncHandle(async (req, res, next) => {
        let { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).json({ message: 'successfully delete' });
    }),
};
