const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const schemaValidator =require('../utils/validatePassword')

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide valid email'],
    unique: true,
    lowercase: true,
    validate: validator.isEmail,
  },
  role: {
    type: String,
    enum: ['admin', 'user','seller'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // Works only on .crate and .save
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Middleware
usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if(!schemaValidator.validate(this.password)){
    const message =schemaValidator.validate(this.password,{details:true})[0].message;
    return next(new AppError(message,500))
  }
  schemaValidator.validate(this.password,{details:true})

  this.password = await bcrypt.hash(this.password, process.env.BCRYPT_SALT * 1);
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Methods
usersSchema.methods.correctPassword = async (candidatePassword, userPassword) => await bcrypt.compare(candidatePassword, userPassword);
usersSchema.methods.changedPasswordAfter = function (JWTtimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTtimeStamp < changedTimestamp;
  }
  return false;
};

usersSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', usersSchema);
module.exports = User;
