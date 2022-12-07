const express = require("express");

const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(authController.protect, bookController.addBook);

router.route("/download").get(authController.protect, bookController.download);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(authController.protect, bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

router
  .route("/amount/:id")
  .patch(authController.protect, bookController.addBookCopy)
  .delete(authController.protect, bookController.deleteBookCopy);
module.exports = router;
