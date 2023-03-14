const bcrypt = require('bcrypt');

const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');
const sendMail = require('../common/sendMail');

module.exports = {
    // [GET] /auth/register
    registerSite: asyncHandle(async (req, res) => {
        if (req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
            return res.redirect('/');
        res.render('auth/register');
    }),

    // [POST] /auth/register
    createUser: asyncHandle(async (req, res) => {
        const userReq = req.body;
        if (await User.isUsernameExisted(userReq.username)) {
            return res.json({
                msg: 'Tên đăng nhập đã tồn tại!',
            });
        }
        if (await User.isEmailExisted(userReq.email)) {
            return res.json({
                msg: 'Email đã tồn tại!',
            });
        }
        if (userReq.password !== userReq.cfpassword) {
            return res.json({
                msg: 'Mật khẩu không trùng khớp!',
            });
        }
        await User.create({
            full_name: userReq.full_name,
            phone_number: userReq.phone_number,
            username: userReq.username,
            password: userReq.password,
            email: userReq.email,
        });
        res.status(201).redirect('/auth/login');
    }),

    // [GET] /auth/login
    loginSite: asyncHandle(async (req, res) => {
        if (req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
            return res.redirect('/');
        res.render('auth/login', { msg: '' });
    }),

    // [POST] /auth/login
    login: asyncHandle(async (req, res, next) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            // return next(new ErrorResponse('Not found user', 401));
            return res.render('auth/login', {
                msg: 'Tên đăng nhập hoặc mật khẩu không chính xác',
            });
        }
        if (!(await user.isPasswordMatch(password))) {
            // return next(new ErrorResponse('Invalid password', 401));
            return res.render('auth/login', {
                msg: 'Tên đăng nhập hoặc mật khẩu không chính xác',
            });
        }

        const token = await user.signToken();
        // res.setHeader('Authorization', 'Bearer ' + token);

        res.cookie(process.env.LABEL_ACCESS_TOKEN, token, {
            signed: true,
            httpOnly: true,
            maxAge: 1000 * 60 * process.env.COOKIE_EXPIRE || 1000 * 60 * 60,
        });

        res.redirect('..');
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
        if (req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
            return res.redirect('/');
        res.render('auth/forget-password');
    }),

    // [POST] /auth/forget-password
    forgetPassword: asyncHandle(async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        // if (!user) return next(new ErrorResponse('Not found email', 401));
        if (!user)
            return res.render('auth/forget-password', {
                msg: 'Not found email. Please enter the email which was registered!',
            });

        await user.createResetPasswordToken();

        const linkToReset = `${process.env.BASE_URL}/auth/change-password?tk=${user.reset_password_token}`;
        const htmlContent = `<h3>Click to this link to reset your password</h3> <a href='${linkToReset}'>${linkToReset}</a>`;
        await sendMail(user.email, 'Reset Password', htmlContent);

        res.redirect('/auth/reset-password-successfully');
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
        if (!user) return next(new ErrorResponse('Token không hợp lệ!', 401));

        if (Date.now() > user.reset_password_token_expired)
            return next(new ErrorResponse('Token hết hạn!', 401));

        const { newPassword } = req.body;
        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashNewPassword });

        if (req.signedCookies[process.env.LABEL_ACCESS_TOKEN])
            res.clearCookie(process.env.LABEL_ACCESS_TOKEN);
        res.status(200).redirect('/auth/login');
    }),
};
