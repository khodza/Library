const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
//security

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const errorHandler = require("./handlers/errorHandler");
const leaseRouter = require("./routes/leaseRoute");
const userRoute = require("./routes/userRoute");
const bookRoute = require("./routes/bookRoute");

const app = express();

app.use(cors());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in hour ",
});

app.use("/api", limiter);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: ["book"],
  })
);

app.use("/api/v1/leases", leaseRouter);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/books", bookRoute);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: `Can not find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

module.exports = app;
