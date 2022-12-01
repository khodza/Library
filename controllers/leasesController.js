const handleFactory = require("../handlers/handleFactory");
const Lease = require("../modules/leaseModule");
const Book = require("../modules/bookModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllLeases = handleFactory.getAll(Lease);
exports.getLease = handleFactory.getOne(Lease);
exports.addLease = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.body.orderedBook);
  if (!book) return next(new AppError("Bunday kitob bazada mavjud emas!", 404));
  if (book.amount <= 0) {
    return next(new AppError("Bu kitob kutubxonada qolmagan!", 404));
  }
  book.amount -= 1;
  await book.save();

  const doc = await Lease.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
exports.updateLease = handleFactory.updateOne(Lease);
exports.deleteLease = catchAsync(async (req, res, next) => {
  const lease = await Lease.findById(req.params.id);
  if (!lease) return next(new AppError("Bu ID lik ijara topilmadi!", 404));
  lease.active = false;
  await lease.save();
  res.status(200).json({
    status: "success",
    message: "Ijara ochirildi",
  });
});
exports.getAllDeletedLeases = async (req, res, next) => {
  const leases = await Lease.aggregate([{ $match: { active: false } }]);
  res.status(200).json({
    status: "success",
    data: {
      doc: leases,
    },
  });
};
