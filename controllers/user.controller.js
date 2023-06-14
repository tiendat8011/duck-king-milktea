const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

module.exports = {
  // [GET] /users/admin
  getAllUsers: asyncHandle(async (req, res, next) => {
    const users = await User.find();
    const user = await User.findOne({
      username: res.locals.username,
    });
    // res.status(200).json(users);
    res.render('admin/users', {
      users,
      userFName: user?.full_name,
      userRole: user?.role,
      userId: user?.id,
      user,
    });
  }),

  // [GET] /users/:id
  getUser: asyncHandle(async (req, res, next) => {
    let { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  }),

  changePassword: asyncHandle(async (req, res, next) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return next(new ErrorResponse('Mật khẩu không trùng khớp', 400));
    }
    const user = await User.findOne({ username: res.locals.username });
    if (!(await user.isPasswordMatch(oldPassword))) {
      return next(new ErrorResponse('Mật khẩu cũ không hợp lệ', 400));
    }
    user = {
      ...user,
      password: newPassword,
    };
    await user.save();
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
    const user = await User.findById(id);
    if (user.username === 'chi' || user.username === process.env.ADMIN_USERNAME)
      return new ErrorResponse('Không thể xóa người dùng này!', 400);
    await User.findByIdAndDelete(id);
    res.status(204).json({ message: 'successfully delete' });
  }),
};
