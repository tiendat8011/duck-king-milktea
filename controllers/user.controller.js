const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

// [GET] /users/
const getAllUsersAndPosts = asyncHandle(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
});

// [GET] /users/:id
const getUserAndPosts = asyncHandle(async (req, res, next) => {
    let { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
});

// [POST] /users/
const createUser = asyncHandle(async (req, res, next) => {
    await User.create(req.body);
    res.status(201).redirect('/auth/login');
});

// [PUT] users/:id
const updateUserById = asyncHandle(async (req, res, next) => {
    let { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    res.status(200).json(user);
});

// [DELETE] users/:id
const deleteUserById = asyncHandle(async (req, res, next) => {
    let { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).json({ message: 'successful' });
});

module.exports = {
    getAllUsersAndPosts,
    getUserAndPosts,
    createUser,
    updateUserById,
    deleteUserById,
};
