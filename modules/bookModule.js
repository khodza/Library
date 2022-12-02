const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
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
    wb_code: {
      type: String,
    },
    codes: {
      type: [String],
      required: [true, "Kitobning Seria raqamini kiriting!"],
    },
    get_from: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.virtual("amount").get(function () {
  console.log(this.codes);
  return this.codes.length;
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
