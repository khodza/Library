const express = require("express");

const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    bookController.uploadFileOnAdd,
    bookController.addBook
  );

router.route("/download").get(bookController.downloadAllBooks);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(authController.protect, bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

router
  .route("/amount/:id")
  .patch(authController.protect, bookController.addBookCopy)
  .delete(authController.protect, bookController.deleteBookCopy);

router
  .route("/upload/:id")
  .post(
    authController.protect,
    bookController.uploadFile,
    bookController.uploadPdf
  );
router.route("/download/:id").get(bookController.downloadPdfFile);
router.route("/preview/:id").get(bookController.previewPdf);
router.route("/search").post(bookController.searchBook);
module.exports = router;
