const Joi = require('joi');

const passwordValidate = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
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
        password: Joi.string().required().custom(passwordValidate),
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
        newPassword: Joi.string().required().custom(passwordValidate),
    }),
};

module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
};
