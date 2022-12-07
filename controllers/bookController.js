const XLSX = require("xlsx");
const handleFactory = require("../handlers/handleFactory");
const Book = require("../modules/bookModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllBooks = handleFactory.getAll(Book, { _id: { $exists: true } });
exports.addBook = catchAsync(async (req, res, next) => {
  const doc = await Book.create(req.body);
  const qrCode = await doc.qrcode();
  res.status(200).json({
    status: "success",
    data: {
      doc,
      qrCode,
    },
  });
});
exports.addBookCopy = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const bookCodes = req.body.codes;

  const matchings = book.codes.filter((obj) => bookCodes.indexOf(obj) !== -1);
  if (matchings.length > 0)
    return next(
      new AppError(`Bu serialik ${matchings} kitoblar bazada mavjud!`)
    );
  bookCodes.forEach((code) => {
    book.codes.push(code);
  });
  await book.save();
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});
exports.deleteBookCopy = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const bookCodes = req.body.codes;
  bookCodes.forEach((code) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < book.codes.length; i++) {
      if (book.codes[i] === code) {
        book.codes.splice(i, 1);
      }
    }
  });
  await book.save();
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});
exports.updateBook = handleFactory.updateOne(Book);
// exports.getBook = handleFactory.getOne(Book);
exports.getBook = catchAsync(async (req, res, next) => {
  const doc = await Book.findById(req.params.id);
  if (!doc) {
    return next(new AppError("Bu ID lik dakument topilmadi!", 404));
  }
  const qrCode = await doc.qrcode();
  res.status(200).json({
    status: "success",
    data: {
      doc,
      qrCode,
    },
  });
});
exports.deleteBook = handleFactory.deleteOne(Book);

exports.download = catchAsync(async (req, res, next) => {
  const wb = XLSX.utils.book_new(); //new workbook
  const data = await Book.find();
  let temp = JSON.stringify(data);
  temp = JSON.parse(temp);
  const ws = XLSX.utils.json_to_sheet(temp);
  const down = `${__dirname}/public/exportdata.xlsx`;
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(wb, down);
  res.download(down);
});
