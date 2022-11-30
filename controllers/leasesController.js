const handleFactory =require('../handlers/handleFactory')
const Lease =require('../modules/leaseModule')

exports.getAllLeases =handleFactory.getAll(Lease)
exports.addLease =handleFactory.createOne(Lease)