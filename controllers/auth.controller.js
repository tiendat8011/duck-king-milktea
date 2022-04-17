const bcrypt = require('bcrypt');

const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');
const sendMail = require('../common/sendMail');

module.exports = {
    // [GET] /auth/register
    registerSite: asyncHandle(async (req, res, next) => {
        res.render('auth/register');
    }),

    // [POST] /auth/register
    createUser: asyncHandle(async (req, res, next) => {
        await User.create({
            full_name: req.body.full_name,
            phone_number: req.body.phone_number,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        });
        res.status(201).redirect('/auth/login');
    }),

    // [GET] /auth/login
    loginSite: asyncHandle(async (req, res, next) => {
        res.render('auth/login');
    }),

    // [POST] /auth/login
    login: asyncHandle(async (req, res, next) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return next(new ErrorResponse('Not found user', 401));
        }
        if (!(await user.isPasswordMatch(password))) {
            return next(new ErrorResponse('Invalid password', 401));
            // res.render('auth/login');
        }

        user.signToken();

        res.render('home');
    }),

    // [GET] /auth/forget-password
    forgetPasswordSite: asyncHandle(async (req, res, next) => {
        res.render('auth/forget-password', { msg: '' });
    }),

    // [POST] /auth/forget-password
    forgetPassword: asyncHandle(async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        // if (!user) return next(new ErrorResponse('Not found email', 401));
        if (!user)
            res.render('auth/forget-password', {
                msg: 'Not found email. Please enter the email which was registered!',
            });

        await user.createResetPasswordToken();

        const linkToReset = `http://${process.env.BASE_URL}/auth/change-password?tk=${user.reset_password_token}`;
        const htmlContent = `<h3>Click to this link to reset your password</h3> <a href='${linkToReset}'>${linkToReset}</a>`;
        await sendMail(user.email, 'Reset Password', htmlContent);

        return res.redirect('/auth/reset-password-successfully');
    }),

    // [GET] /auth/reset-password-successfully
    successfullyReset: asyncHandle(async (req, res, next) => {
        res.render('auth/successfully-reset-pw');
    }),

    // [GET] /auth/change-password?tk=....
    changePasswordSite: asyncHandle(async (req, res, next) => {
        const token = req.query.tk;
        res.render('auth/change-password', { token });
    }),

    // [PUT] /auth/change-password?tk=...
    changePassword: asyncHandle(async (req, res, next) => {
        const token = req.query.tk;

        const user = await User.findOne({ reset_password_token: token });
        if (!user) return next(new ErrorResponse('Invalid token', 401));

        if (Date.now() > user.reset_password_token_expired)
            return next(new ErrorResponse('Expired token', 401));

        const { newPassword } = req.body;
        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashNewPassword });

        res.status(200).redirect('/auth/login');
    }),
};
