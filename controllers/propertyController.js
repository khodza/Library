const Property =require('../modules/propertyModule')
const handleFactory =require('../handlers/handleFactory')

exports.getAllCategories =handleFactory.getAll(Property, {
    _id: { $exists: true },
  });
  
exports.getCategory =handleFactory.getOne(Property)
exports.addCategory =handleFactory.createOne(Property)
exports.deleteCategory =handleFactory.deleteOne(Property)