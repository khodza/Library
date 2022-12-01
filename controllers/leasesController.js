const handleFactory = require("../handlers/handleFactory");
const Lease = require("../modules/leaseModule");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllLeases = handleFactory.getAll(Lease);
exports.getLease = handleFactory.getOne(Lease);
exports.addLease = handleFactory.createOne(Lease);
exports.updateLease = handleFactory.updateOne(Lease);
exports.deleteLease = catchAsync(async (req, res, next) => {
  const lease = await Lease.findById(req.params.id);
  if (!lease) return next(new AppError("Bu ID lik ijara topilmadi!", 404));
  lease.active = false;
  await lease.save();
  res.status(200).json({
    status: "success",
    message: "Ijara ochirildi",
  });
});
exports.getAllDeletedLeases = async (req, res, next) => {
  const leases = await Lease.aggregate([{ $match: { active: false } }]);
  res.status(200).json({
    status: "success",
    data: {
      doc: leases,
    },
  });
};
