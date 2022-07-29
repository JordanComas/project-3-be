var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fileUploader = require("../middleware/cloudinary");

const { isAuthenticated } = require("../middleware/auth");

const User = require("../models/User");
const saltrounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//C
router.post("/signup", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please enter username and password" });
  }

  try {
    const salt = bcrypt.genSaltSync(saltrounds);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      password: hashedPass,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      profilePic: req.body.profilePic,
    });

    const payload = {
      userame: newUser.username,
      id: newUser._id,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json(token);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//R
router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please enter username and password" });
  }

  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const isMatch = bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }

    const payload = {
      username: foundUser.username,
      id: foundUser._id,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json(token);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post(
  "/add-picture",
  fileUploader.single("imageUrl"),
  async (req, res) => {
    res.json(req.file);
  }
);

module.exports = router;
