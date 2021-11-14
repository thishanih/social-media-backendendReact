const express = require("express");
const newsRouter = express.Router();
const newsmodel = require("../models/New");
const { addNewsValidation } = require("../validation");
let multer = require("multer");
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

newsRouter.post("/addNews", upload.single("image"), async (req, res, next) => {
  // Validate the  addNews
  const url = req.protocol + "://" + req.get("host");

  const { error } = addNewsValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Regsiter new Post
  const news = new newsmodel({
    title: req.body.title,
    message: req.body.message,
    image: url + "/public/" + req.file.filename,
    like: 0,
    dislike: 0,
  });

  try {
    const savednews = await news.save();
    res.json(savednews);
  } catch (error) {
    res.json({ message: error });
  }
});

// Display post data

newsRouter.get("/", async (req, res) => {
  try {
    const news = await newsmodel.find();
    res.json(news);
  } catch (err) {
    res.json({ message: error });
  }
});

// Delect post data

newsRouter.delete("/delectNews/:newsId", async (req, res) => {
  try {
    const newsId = await newsmodel.findByIdAndRemove(req.params.newsId);

    res.json(newsId);
  } catch (error) {
    res.json(error);
  }
});

newsRouter.put("/updateLike/:newsId", async (req, res) => {
  try {
    const updateItem = await newsmodel.updateOne(
      { _id: req.params.newsId },
      {
        $set: {
          like: req.body.like,
        },
      }
    );
    res.json(req.body);
  } catch (error) {
    res.json(error);
  }
});

newsRouter.put("/updatedisLike/:newsId", async (req, res) => {
  try {
    const updateItem = await newsmodel.updateOne(
      { _id: req.params.newsId },
      {
        $set: {
          dislike: req.body.dislike,
        },
      }
    );
    res.json(req.body);
  } catch (error) {
    res.json(error);
  }
});

module.exports = newsRouter;
