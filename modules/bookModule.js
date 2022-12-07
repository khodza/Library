const mongoose = require("mongoose");
const _ = require("underscore");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const bookSchema = new mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, `Kitob nomini kiriting`],
    },
    author: {
      type: String,
      required: [true, `Kitob muallifini kiriting`],
    },
    year: {
      type: Number,
    },
    pages: {
      type: Number,
      required: [true, `Kitob betlari sonini kiriting`],
    },
    cd_disk: {
      type: String,
    },
    codes: [
      {
        type: String,
        required: [true, "Kitob serialarini qoshing!"],
      },
    ],
    get_options: {
      type: String,
    },
    price: {
      type: String,
    },
    lang: {
      type: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.pre("save", function (next) {
  if (JSON.stringify(this.codes) === JSON.stringify(_.uniq(this.codes))) next();

  next(new AppError("Birxil serialik kitob kiritish mumkun emas", 400));
});

bookSchema.virtual("amount").get(function () {
  if (!this.codes) return null;
  return this.codes.length;
});

bookSchema.methods.qrcode = catchAsync(async function () {
  return await genQrCode(this.id);
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
