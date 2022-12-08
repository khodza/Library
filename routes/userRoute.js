const express = require("express");

const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const loginLimiter = rateLimit({
  max: 5,
  windowMs: 30 * 60 * 1000,
  handler: (request, response, next) =>
    response.status(429).json({
      status: "failed",
      message: "Too many attempts. Please try again after 30 min",
    }),
});

const router = express.Router();
router
  .route("/:idNumber")
  .get(authController.protect, userController.getTempUser);

// router.post('/signup',authController.signUp)
router.post("/login", loginLimiter, authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch(
  "/updateme",
  authController.protect,
  userController.updateMe,
  userController.updateUser
);
router.patch(
  "/updatemypassword",
  authController.protect,
  authController.updateMyPassword
);

module.exports = router;
