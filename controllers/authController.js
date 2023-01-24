const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const User = require("../modules/usersModule");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    cookieOptions,
    data: {
      user,
    },
  });
};

// exports.signUp = catchAsync(async (req, res, next) => {
//   if(req.body.role ){
//     return next(new AppError(`You can't set your role manually!,Contact to administration to do so`))
//   }
//   const newUser = await User.create(req.body);
//   createSendToken(newUser, 201, res);
// });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)  Checking Email and Password
  if (!email || !password) {
    return next(new AppError("Email va Parolni ni kiriting"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Xato parol yoki email", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Checking token and if its there!
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } 
  if (!token) {
    return next(new AppError("Siz log in qilmagansiz!", 401));
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("Bu tokenga tegishli faydalanuvchi mavjud emas!", 401)
    );
  }

  // 4) Check if user changed password after token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Foydalanuvchi yaqinda parolni o'zgartirdi.Iltimos qayta log in qiling ",
        401
      )
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Sizga bu harakatni bajarish taqiqlangan!", 403)
      );
    }
    next();
  };
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Hozirgi parolingiz xato!", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Bu email bilan foydalanuvchi topilmadi!", 404));
  }
  const resetToken = user.createResetToken();
  // console.log(user);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Parolni unutdingizmi? Shu URL ga PATCH so'rovini yuboring, va yangi parol kiritib uni tasdiqlang : ${resetUrl}\nAgar parolni unutmagan bo'lsangiz bu emailga etibor bermang!`;

  try {
    await sendEmail({
      email: user.email,
      subject:
        " Sizning parolingizi yangilash uchun token(10 daqiqagacha yaroqli)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token jo'natildi!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Email jo'natishta hatolik.Iltimos keyinroq harakat qiling!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Yaroqsiz token yoki muddati o'tkan token!"));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
