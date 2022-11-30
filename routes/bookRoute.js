const express = require("express");

const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(authController.protect, bookController.addBook);
module.exports = router;
