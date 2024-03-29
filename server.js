const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection * . Shutting down!");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DATABASE Connected Successfully!");
});
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Waiting at port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection .Shutting down!");
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM',()=>{
  console.log(`SIGTERM IS RECEIVED SHUTTING DOWN  `);
  server.close(()=>{
    console.log('Process terminated');
  })
})