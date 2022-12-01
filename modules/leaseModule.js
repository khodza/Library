const mongoose = require("mongoose");
// const slugify =require('slugify')

// const User =require('./usersModule')

const leaseSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, `O'quvchining ismini kiriting`],
  },
  orderedBook: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: [true, `Kitob nomini kiriting`],
  },
  orderedTime: {
    type: Date,
    default: Date.now,
  },
  classOfStudent: {
    type: Number,
    required: [true, `O'quvchining gurux raqamini qoshing`],
  },
  major: {
    type: String,
    required: [true, `O'quvchining o'quv yo'nalishini koriting`],
    enum: ["Civil", "Electrical", "Architecture"],
  },
  deadline: {
    type: Date,
  },
  studentPhoneNumber: {
    type: String,
    required: [true, `O'quvchining telefon raqamini kiriting!`],
  },
});

leaseSchema.pre("save", function (next) {
  this.deadline = new Date(
    this.orderedTime.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  next();
});

leaseSchema.pre(/^find/, function (next) {
  this.populate({ path: "orderedBook", select: "year , author" });
  next();
});
const Lease = mongoose.model("Lease", leaseSchema);
module.exports = Lease;
