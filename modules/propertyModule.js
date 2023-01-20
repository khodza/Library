const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    category:{type:String,required:[true,`Katigoriya tanlanmadi`],}
});

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
