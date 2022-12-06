const handleFactory = require("../handlers/handleFactory");
const Lease = require("../modules/leaseModule");
const Book = require("../modules/bookModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const getMaxPage = require("../utils/maxPage");

exports.getAllLeases = handleFactory.getAll(Lease);
exports.getLease = handleFactory.getOne(Lease);
exports.addLease = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.body.orderedBook);
  if (!book) return next(new AppError("Bunday kitob bazada mavjud emas!", 404));
  if (book.amount <= 0) {
    return next(new AppError("Bu kitob kutubxonada qolmagan!", 404));
  }
  const orderedBookSeria = req.body.orderedBookSeria;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < book.codes.length; i++) {
    if (book.codes[i] === orderedBookSeria) {
      book.codes.splice(i, 1);
    }
  }
  await book.save();

  const doc = await Lease.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateLease = catchAsync(async (req, res, next) => {
  const lease = await Lease.findById(req.params.id);
  if (!lease) return next(new AppError("Bu ID lik ijara topilmadi!", 404));
  const oldBook = await Book.findById(lease.orderedBook);
  if (!oldBook) return next(new AppError("Eski kitob topilmadi!"));
  const newBook = await Book.findById(req.body.orderedBook);
  if (!newBook) return next(new AppError("Bu ID bilan yangi kitob topilmadi!"));
  if (oldBook !== newBook) {
    oldBook.amount += 1;
    newBook.amount -= 1;
    await oldBook.save();
    await newBook.save();
  }
  const doc = await Lease.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
exports.deleteLease = catchAsync(async (req, res, next) => {
  const lease = await Lease.findById(req.params.id);
  if (!lease) return next(new AppError("Bu ID lik ijara topilmadi!", 404));
  const book = await Book.findById(lease.orderedBook);
  if (!book) return next(new AppError("Bunday kitob bazada mavjud emas!", 404));
  const orderedBookSeria = lease.orderedBookSeria;
  book.codes.push(orderedBookSeria);
  await book.save();
  lease.active = false;
  lease.deletedAt = Date.now();
  await lease.save();
  res.status(200).json({
    status: "success",
    message: "Ijara ochirildi",
  });
});
exports.getAllDeletedLeases = async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const leases = await Lease.aggregate([
    { $match: { active: false } },
    { $sort: { deletedAt: -1 } },
  ])
    .skip(skip)
    .limit(limit);
  await Book.populate(leases, {
    path: "orderedBook",
    select: ["year", "name", "author"],
  });
  const maxPage = await getMaxPage(Lease, { active: false }, req);
  res.status(200).json({
    status: "success",
    maxPage,
    results: leases.length,
    data: {
      doc: leases,
    },
  });
};
exports.deleteHistory = catchAsync(async (req, res, next) => {
  await Lease.deleteMany({
    active: false,
    deletedAt: {
      $lte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime(),
    },
  });
  res.status(200).json({
    status: "success",
    message: "Bir yillik ijara tarixi o'chirildi",
  });
});
