const mongoose = require("mongoose");

const arrayUniquePlugin = require("mongoose-unique-array");

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
    cd_disk: {
      type: String,
    },
    codes: [{ type: String, unique: true }],
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

bookSchema.virtual("amount").get(function () {
  console.log(this.codes);
  return this.codes.length;
});
bookSchema.plugin(arrayUniquePlugin);
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
