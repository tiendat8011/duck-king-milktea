const Joi = require('joi');

const passwordValidate = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('Mật khẩu phải dài ít nhất 8 kí tự!');
    }
    // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    //     return helpers.message(
    //         'password must contain at least 1 letter and 1 number'
    //     );
    // }
    return value;
};

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(passwordValidate).label('Password'),
        cfpassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': 'Mật khẩu không khớp!' }),
        username: Joi.string().required().alphanum().min(6).max(20),
        full_name: Joi.string().required(),
        phone_number: Joi.string()
            .required()
            .pattern(/^[0-9]+$/)
            .required(),
    }),
};

const login = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const forgetPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    body: Joi.object().keys({
        newPassword: Joi.string().required().custom(passwordValidate).label('Password'),
        cfNewPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': 'Mật khẩu không khớp!' }),
    }),
};

module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
};
