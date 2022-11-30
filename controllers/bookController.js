const handleFactory = require("../handlers/handleFactory");
const Book = require("../modules/bookModule");

exports.getAllBooks = handleFactory.getAll(Book);
exports.addBook = handleFactory.createOne(Book);
exports.getBook = handleFactory.getOne(Book);
exports.updateBook = handleFactory.updateOne(Book);
exports.deleteBook = handleFactory.deleteOne(Book);
