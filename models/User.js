const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Order = require('../models/Order');

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Require full name'],
      trim: true,
    },
    year_of_birth: { type: Number, trim: true },
    phone_number: {
      type: String,
      required: [true, 'Require phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    username: {
      type: String,
      required: [true, 'Require username'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Require password'],
    },
    email: {
      type: String,
      required: [true, 'Require email'],
      unique: true,
      validate: [validator.isEmail, 'Invalid email'],
      trim: true,
    },
    reset_password_token: String,
    reset_password_token_expired: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.createResetPasswordToken = async function () {
  const token = await crypto.randomBytes(15).toString('hex');

  this.reset_password_token = await crypto
    .createHash(
      'sha256',
      process.env.RESET_TOKEN_PRIVATE_MESSAGE || 'somethingprivate'
    )
    .update(token)
    .digest('hex');
  this.reset_password_token_expired =
    Date.now() + process.env.RESET_TOKEN_EXPIRE * 60 * 1000 || 5 * 60 * 1000;
  await this.save();
};

userSchema.methods.signToken = async function () {
  const token = jwt.sign({ username: this.username }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE || '8h',
  });
  return token;
};

userSchema.statics.isEmailExisted = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.statics.isUsernameExisted = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
