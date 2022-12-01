const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../modules/usersModule");
const Book = require("../modules/bookModule");
const Lease = require("../modules/leaseModule");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connected successifuly");
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/usersData.json`, "utf-8")
);
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/booksData.json`, "utf-8")
);
const leases = JSON.parse(
  fs.readFileSync(`${__dirname}/leasesData.json`, "utf-8")
);

const importData = async () => {
  try {
    await User.create(users);
    await Book.create(books);
    await Lease.create(leases);
    console.log(`Data uploaded successfully`);
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();
    await Lease.deleteMany();
    console.log(`Data deleted successfully`);
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
