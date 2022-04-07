const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

// [GET] /auth/register
module.exports.registerSite = asyncHandle(async (req, res, next) => {
    res.render('register');
});

// [GET] /auth/login
module.exports.loginSite = asyncHandle(async (req, res, next) => {
    res.render('login');
});

// [POST] /auth/login
module.exports.login = asyncHandle(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return next(new ErrorResponse('Not found user', 401));
    }
    if (!(await user.isPasswordMatch(password))) {
        return next(new ErrorResponse('Invalid password', 401));
    }

    const token = jwt.sign({ username }, process.env.PRIVATE_KEY, {
        expiresIn: '1h',
    });

    res.status(200).json({ token });
});

// [GET] auth/forget-password
module.exports.forgetPasswordSite = asyncHandle(async (req, res, next) => {
    res.render('forget-password');
});

// [POST] auth/forget-password
module.exports.forgetPassword = asyncHandle(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse('Not found email', 401));
    await user.createResetPasswordToken();
    return res
        .status(200)
        .redirect(`/auth/change-password?tk=${user.reset_password_token}`);
});

// [GET] auth/change-password?tk=....
module.exports.changePasswordSite = asyncHandle(async (req, res, next) => {
    const token = req.query.tk;
    res.render('change-password', { token });
});

// [PUT] auth/change-password?tk=...
module.exports.changePassword = asyncHandle(async (req, res, next) => {
    const token = req.query.tk;

    const user = await User.findOne({ reset_password_token: token });
    if (!user) return next(new ErrorResponse('Invalid token', 401));

    if (Date.now() > user.reset_password_token_expired)
        return next(new ErrorResponse('Expired token', 401));

    const { newPassword } = req.body;
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashNewPassword });
    res.status(200).redirect('/auth/login');
});
