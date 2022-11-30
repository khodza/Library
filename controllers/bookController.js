const handleFactory = require("../handlers/handleFactory");
const Book = require("../modules/bookModule");

exports.getAllBooks = handleFactory.getAll(Book);
exports.addBook = handleFactory.createOne(Book);
