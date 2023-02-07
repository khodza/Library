const express = require("express");
const leasesController = require("../controllers/leasesController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.route("/download").get(leasesController.downloadAllLeases);
router.route("/history/download").get(leasesController.downloadAllHistory);

router
  .route("/history")
  .get(leasesController.getAllDeletedLeases)
  .delete(leasesController.deleteHistory);
router
  .route("/")
  .get(leasesController.getAllLeases)
  .post(leasesController.addLease);
router
  .route("/:id")
  .get(leasesController.getLease)
  .patch(leasesController.updateLease)
  .delete(leasesController.deleteLease);


router.route("/search").post(leasesController.searchLease);
router.route("/history/search").post(leasesController.searchLeaseHistory);
module.exports = router;
