const handleFactory = require("../handlers/handleFactory");
const Book = require("../modules/bookModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllBooks = handleFactory.getAll(Book);
exports.addBook = handleFactory.createOne(Book);
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
exports.getBook = handleFactory.getOne(Book);
exports.deleteBook = handleFactory.deleteOne(Book);
