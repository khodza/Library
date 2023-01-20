const express = require("express");

const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");
const propertyController =require('../controllers/propertyController');

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    bookController.uploadFileOnAdd,
    bookController.addBook
  );

//Category
router.route("/category").get(propertyController.getAllCategories).post(propertyController.addCategory)
router.route("/category/:id").delete(propertyController.deleteCategory).get(propertyController.getCategory)

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(authController.protect, bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

router
  .route("/amount/:id")
  .patch(authController.protect, bookController.addBookCopy)
  .delete(authController.protect, bookController.deleteBookCopy);
//Upload PDF
router
  .route("/upload/:id")
  .post(
    authController.protect,
    bookController.uploadFile,
    bookController.uploadPdf
  );

//Preview and Download PDF
router.route("/download").get(bookController.downloadAllBooks);
router.route("/download/:id").get(bookController.downloadPdfFile);
router.route("/preview/:id").get(bookController.previewPdf);

//Search
router.route("/search").post(bookController.searchBook);



module.exports = router;
