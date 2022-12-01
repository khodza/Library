const express = require("express");
const leasesController = require("../controllers/leasesController");
const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.protect);

router.route("/history").get(leasesController.getAllDeletedLeases);
router
  .route("/")
  .get(leasesController.getAllLeases)
  .post(leasesController.addLease);
router
  .route("/:id")
  .get(leasesController.getLease)
  .patch(leasesController.updateLease)
  .delete(leasesController.deleteLease);

module.exports = router;
