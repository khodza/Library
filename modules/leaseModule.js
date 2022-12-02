const mongoose = require("mongoose");
const slugify = require("slugify");

const leaseSchema = new mongoose.Schema(
  {
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
      required: [true, `O'quvchining o'quv yo'nalishini kiriting`],
      enum: ["Civil", "Electrical", "Architecture"],
    },
    deadline: {
      type: Date,
    },
    studentPhoneNumber: {
      type: String,
      required: [true, `O'quvchining telefon raqamini kiriting!`],
    },
    slug: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
leaseSchema.index({ slug: 1 });
leaseSchema.index({ active: 1 });

leaseSchema.virtual("shouldBeReturned").get(function () {
  return Date.now() > this.deadline;
});

leaseSchema.pre("save", function (next) {
  this.deadline = new Date(
    this.orderedTime.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  this.slug = slugify(
    `${this.studentName} ${this.major} ${this.classOfStudent}`,
    { lower: true }
  );
  next();
});

leaseSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
leaseSchema.pre(/^find/, function (next) {
  this.populate({ path: "orderedBook", select: ["year", "name", "author"] });
  next();
});
const Lease = mongoose.model("Lease", leaseSchema);
module.exports = Lease;
