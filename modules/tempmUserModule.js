const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Please add your name"],
  },
  immage: {
    type: String,
  },
  id: {
    type: String,
  },
  full_id: {
    type: String,
  },
  faculty: {
    type: String,
  },
  group: {
    type: String,
  },
  phone_number: {
    type: String,
  },
});

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = TempUser;
