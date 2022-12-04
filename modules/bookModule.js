const mongoose = require("mongoose");

const arrayUniquePlugin = require("mongoose-unique-array");
const _ = require("underscore");
const AppError = require("../utils/appError");

const bookSchema = new mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, `Kitob nomini kiriting`],
    },
    author: {
      type: String,
      required: [true, `Kitob avtorini kiriting`],
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
        unique: [true, "dublicate errror"],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.pre("save", function (next) {
  if (this.codes === _.uniq(this.codes)) next();
  next(new AppError("Birxil serialik kitob kiritish mumkun emas", 400));
});

bookSchema.virtual("amount").get(function () {
  if (!this.codes) return null;
  return this.codes.length;
});
// bookSchema.plugin(arrayUniquePlugin);
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
