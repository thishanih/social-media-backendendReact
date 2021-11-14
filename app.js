const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const newsRouter = require("./routes/news");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/news", newsRouter); // This string value use for Main Routing

const dbConfig = require("./config/config.js");

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("Sever Connected port 5000");
});
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
