const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
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
  code: {
    type: String,
  },
  get_from: {
    type: String,
  },
  price: {
    type: Number,
  },
  amount: {
    type: Number,
    default: 1,
  },
 
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
