const User = require('../modules/usersModule');
const handleFactory = require('../handlers/handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('In order change your password use /updatePassword', 400));
  }
  req.params.id = req.user.id;
  next();
});
exports.getAllUsers = handleFactory.getAll(User);
exports.getUser = handleFactory.getOne(User);
exports.updateUser = handleFactory.updateOne(User);
exports.deleteUser = handleFactory.deleteOne(User);
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
