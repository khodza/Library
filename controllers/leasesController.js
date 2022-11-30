const handleFactory = require("../handlers/handleFactory");
const Lease = require("../modules/leaseModule");

exports.getAllLeases = handleFactory.getAll(Lease);
exports.getLease = handleFactory.getOne(Lease);
exports.addLease = handleFactory.createOne(Lease);
exports.updateLease = handleFactory.updateOne(Lease);
exports.deleteLease = handleFactory.deleteOne(Lease);
