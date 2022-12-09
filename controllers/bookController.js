const multer = require("multer");
const path = require("path");

const handleFactory = require("../handlers/handleFactory");
const Book = require("../modules/bookModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "data/pdf-Books");
  },
  async filename(req, file, cb) {
    try {
      const bookName = (
        await Book.find({ _id: req.params.id }, { name: 1, _id: 0 })
      )[0].name;
      const ext = file.mimetype.split("/")[1];
      const fileName = `${bookName}-${req.params.id}.${ext}`;
      req.body.file = fileName;
      cb(null, fileName);
    } catch (err) {
      if (err instanceof multer.MulterError) {
        return cb(
          new AppError(
            "There was error in uploading file with app.Please try again!"
          )
        );
      }
      cb(new AppError("Bunday kitob bazada yo'q avval kitobni kiriting!", 404));
    }
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("application") &&
    file.mimetype.endsWith("pdf")
  ) {
    cb(null, true);
  } else {
    cb(new AppError("Not an pdf! Please upload only pdf files.", 400), false);
  }
};

const upload = multer({ storage, fileFilter });
exports.uploadFile = upload.single("file");
exports.uploadPdf = catchAsync(async (req, res, next) => {
  const doc = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError("Bu ID lik dakument topilmadi!!", 404));
  }
  res.status(200).json({
    status: "success",
    message: "File uploaded successfully",
  });
});
exports.getAllBooks = handleFactory.getAll(Book, {
  _id: { $exists: true },
});
exports.addBook = catchAsync(async (req, res, next) => {
  const doc = await Book.create(req.body);
  const qrCode = await doc.qrcode();
  // await addPDF(doc,req)
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

exports.downloadAllBooks = handleFactory.downloadExel(
  Book,
  "barcha-kitoblar.xlsx"
);

exports.downloadPdfFile = catchAsync(async (req, res, next) => {
  const doc = await Book.findById(req.params.id);
  if (!doc) {
    return next(new AppError("Bu ID lik kitob topilmadi!!", 404));
  }
  const { file } = doc;

  if (!file) {
    return next(new AppError(`This book doesn't have pdf file`));
  }
  const link = path.join(__dirname, `../data/pdf-Books/${file}`);
  res.download(link);
});
