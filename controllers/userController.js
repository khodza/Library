const User = require("../modules/usersModule");
const TempUser = require("../modules/tempmUserModule");
const handleFactory = require("../handlers/handleFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Parolni o'zgartirish uchun  /updatePassword ga so'rov yuboring",
        400
      )
    );
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
exports.getTempUser = catchAsync(async (req, res, next) => {
  const tempUser = await TempUser.findOne({ full_id: req.params.idNumber });
  if (!tempUser) return next(new AppError(`O'quvchi topilmadi`));
  res.status(200).json({
    status: "success",
    data: {
      tempUser,
    },
  });
});
