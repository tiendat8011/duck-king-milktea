const Joi = require('joi');

const passwordValidate = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Mật khẩu phải dài ít nhất 8 kí tự!');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      'Mật khẩu phải bao gồm ít nhất 1 chữ cái và 1 chữ số'
    );
  }
  return value;
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ!',
    }),
    password: Joi.string().required().custom(passwordValidate),
    cfpassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Mật khẩu không khớp!' }),
    username: Joi.string().required().alphanum().min(6).max(20).messages({
      'string.min': 'Tên đăng nhập phải dài ít nhất 6 ký tự!',
      'string.max': 'Tên đăng nhập không được dài quá 20 ký tự!',
      'string.alphanum': 'Tên đăng nhập chỉ được bao gồm chữ cái và số!',
    }),
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
    newPassword: Joi.string()
      .required()
      .custom(passwordValidate)
      .label('Password'),
    cfNewPassword: Joi.any()
      .equal(Joi.ref('newPassword'))
      .required()
      .messages({ 'any.only': 'Mật khẩu không khớp!' }),
  }),
};

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
};
