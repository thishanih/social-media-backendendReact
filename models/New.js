const mongoose = require("mongoose");

const News_Schema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  like: {
    type: Number,
    require: true,
  },
  dislike: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("New", News_Schema);
