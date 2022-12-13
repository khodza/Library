const mongoose = require("mongoose");
const _ = require("underscore");
const AppError = require("../utils/appError");
const genQrCode = require("../utils/genQRcode");

const bookSchema = new mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, `Kitob nomini kiriting`],
    },
    author: {
      type: String,
      required: [true, `Kitob muallifini kiriting`],
    },
    year: {
      type: Number,
      required: [true, "Kitobning yilini kiriting!"],
    },
    pages: {
      type: Number,
      required: [true, `Kitob betlari sonini kiriting`],
    },
    category: {
      type: String,
      default: "Aniqlanmagan",
      enum: ["Badiy", "Ilmiy", "Ingilizcha", "Aniqlanmagan"],
    },
    cd_disk: {
      type: Boolean,
      default: false,
    },
    codes: [
      {
        type: String,
        required: [true, "Kitob serialarini qoshing!"],
      },
    ],
    uniqueId: {
      type: String,
      unique: true,
    },
    get_options: {
      type: String,
      default: "Ajou",
    },
    price: {
      type: Number,
      default: 0,
    },
    lang: {
      type: String,
      default: "aniqlanmagan",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    file: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.pre("save", function (next) {
  this.slug = slugify(`${this.studentName}`, { lower: true });
  next();
});

// bookSchema.pre("save", function (next) {
//   if (JSON.stringify(this.codes) === JSON.stringify(_.uniq(this.codes))) next();

//   next(new AppError("Birxil serialik kitob kiritish mumkun emas", 400));
// });

bookSchema.virtual("amount").get(function () {
  if (!this.codes) return null;
  return this.codes.length;
});

bookSchema.methods.qrcode = async function () {
  try {
    const qr = await genQrCode(this.id);
    return qr;
  } catch (err) {
    throw new Error("QR code yaratshta xatolik yuz berdi!");
  }
};
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
