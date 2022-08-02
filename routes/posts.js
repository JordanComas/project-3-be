var express = require("express");
var router = express.Router();
const Post = require("../models/Post");
const { isAuthenticated } = require("../middleware/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ title: "Posts Page" });
});

//C
router.post("/create", isAuthenticated, async (req, res) => {
  console.log(req.user);
  try {
    const newPost = await Post.create({
      //   title: req.body.title,
      content: req.body.content,
      creatorId: req.user.id,
      shoeId: req.body.shoeId,
    });
    res.json(newPost);
  } catch (err) {
    res.json(err.message);
  }
});

//R
// router.get("/all", async (req, res) => {
//   try {
//     const allPosts = await Post.find().populate("creatorId");
//     res.json(allPosts);
//   } catch (err) {
//     res.json(err.message);
//   }
// });

//R
router.get("/comments/:shoeId", async (req, res) => {
  try {
    const allShoes = await Post.find({ shoeId: req.params.shoeId }).populate(
      "creatorId"
    );
    res.json(allShoes);
  } catch (err) {
    res.json(err.message);
  }
});

//U
router.post("/likes/:postId", isAuthenticated, async (req, res) => {
  try {
    let updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json(err.message);
  }
});

//D
router.delete("/delete-comment/:postId", isAuthenticated, async (req, res) => {
  try {
    console.log(req.params);
    const removedComment = await Post.findOneAndDelete(
      {
        _id: req.params.postId,
        creatorId: req.user.id,
      },
      { new: true }
    );
    res.json(removedComment);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
