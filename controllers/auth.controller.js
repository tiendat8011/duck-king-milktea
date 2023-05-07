const bcrypt = require('bcrypt');

const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');
const sendMail = require('../common/sendMail');
const jwt = require('jsonwebtoken');

module.exports = {
  // [GET] /auth/register
  registerSite: asyncHandle(async (req, res) => {
    let token = req.signedCookies?.[process.env.LABEL_ACCESS_TOKEN];
    if (!token) {
      return res.render('auth/register');
    }
    // check expires
    let payload;
    try {
      payload = jwt.verify(token, process.env.PRIVATE_KEY);
      return res.redirect('/');
    } catch (err) {
      console.log(err);
      return res.render('auth/register');
    }
  }),

  // [POST] /auth/register
  createUser: asyncHandle(async (req, res, next) => {
    const userReq = req.body;
    if (await User.isUsernameExisted(userReq.username)) {
      return next(new ErrorResponse('Tên đăng nhập đã tồn tại!', 400));
    }
    if (await User.isEmailExisted(userReq.email)) {
      return next(new ErrorResponse('Email đã tồn tại', 400));
    }
    if (userReq.password !== userReq.cfpassword) {
      return next(new ErrorResponse('Mật khẩu không trùng khớp!', 400));
    }
    const user = await User.create({
      full_name: userReq.full_name,
      phone_number: userReq.phone_number,
      username: userReq.username,
      password: userReq.password,
      email: userReq.email,
    });
    res.status(201).json(user);
  }),

  // [GET] /auth/login
  loginSite: asyncHandle(async (req, res) => {
    let token = req.signedCookies?.[process.env.LABEL_ACCESS_TOKEN];
    if (!token) {
      return res.render('auth/login', { msg: '' });
    }
    // check expires
    let payload;
    try {
      payload = jwt.verify(token, process.env.PRIVATE_KEY);
      return res.redirect('/');
    } catch (err) {
      console.log(err);
      return res.render('auth/login', { msg: '' });
    }
  }),

  // [POST] /auth/login
  login: asyncHandle(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      // return next(new ErrorResponse('Not found user', 401));
      return next(
        new ErrorResponse('Tên đăng nhập hoặc mật khẩu không chính xác', 400)
      );
    }
    if (!(await user.isPasswordMatch(password))) {
      // return next(new ErrorResponse('Invalid password', 401));
      return next(
        new ErrorResponse('Tên đăng nhập hoặc mật khẩu không chính xác', 400)
      );
    }
    const token = await user.signToken();
    // res.setHeader('Authorization', 'Bearer ' + token);

    res.cookie(process.env.LABEL_ACCESS_TOKEN, token, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * process.env.COOKIE_EXPIRE || 1000 * 60 * 60,
    });
    // const curUrl = req.cookies['curUrl'];
    // res.clearCookie('curUrl', { httpOnly: true });
    // console.log(curUrl);
    // if (curUrl) return res.redirect(curUrl);
    return res.status(200).json(user);
  }),
  // [GET] /auth/logout
  logout: asyncHandle(async (req, res) => {
    if (!req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
      return res.redirect('/auth/login');

    res.clearCookie(process.env.LABEL_ACCESS_TOKEN);
    res.status(301).redirect('/');
  }),

  // [GET] /auth/forget-password
  forgetPasswordSite: asyncHandle(async (req, res) => {
    let token = req.signedCookies?.[process.env.LABEL_ACCESS_TOKEN];
    if (!token) {
      return res.render('auth/forget-password', { msg: '' });
    }
    // check expires
    let payload;
    try {
      payload = jwt.verify(token, process.env.PRIVATE_KEY);
      return res.redirect('/');
    } catch (err) {
      console.log(err);
      return res.render('auth/forget-password', { msg: '' });
    }
  }),

  // [POST] /auth/forget-password
  forgetPassword: asyncHandle(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // if (!user) return next(new ErrorResponse('Not found email', 401));
    if (!user)
      return next(
        new ErrorResponse(
          'Địa chỉ email chưa được đăng ký hoặc không tồn tại',
          401
        )
      );

    await user.createResetPasswordToken();

    const linkToReset = `${process.env.BASE_URL}/auth/change-password?tk=${user.reset_password_token}`;
    const htmlContent = `Để đặt lại mật khẩu vui lòng ấn vào link sau: <a href='${linkToReset}'>${linkToReset}</a> (Token sau 3 phút sẽ hết hạn).
    Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này
    `;
    await sendMail(user.email, 'Đặt lại mật khẩu', htmlContent);

    res.status(200).json({ email });
  }),

  // [GET] /auth/reset-password-successfully
  successfullyReset: asyncHandle(async (req, res) => {
    res.render('auth/successfully-reset-pw');
  }),

  // [GET] /auth/change-password?tk=....
  changePasswordSite: asyncHandle(async (req, res) => {
    const token = req.query.tk;
    res.render('auth/change-password', { token });
  }),

  // [PUT] /auth/change-password?tk=...
  changePassword: asyncHandle(async (req, res, next) => {
    const token = req.query.tk;

    const user = await User.findOne({ reset_password_token: token });
    if (!user)
      return next(new ErrorResponse('Token đổi mật khẩu không hợp lệ!', 401));

    if (Date.now() > user.reset_password_token_expired)
      return next(new ErrorResponse('Token đổi mật khẩu hết hạn!', 401));

    const { newPassword, cfNewPassword } = req.body;
    if (newPassword !== cfNewPassword)
      return next(new ErrorResponse('Mật khẩu không khớp', 400));

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashNewPassword });

    if (req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
      res.clearCookie(process.env.LABEL_ACCESS_TOKEN);
    res.status(200).json(user);
  }),
};
