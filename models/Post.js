const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: true,
    // },
    content: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    shoeId: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        // unique: true,
      },
    ],
  }
  //   {
  //     timestamps: true,
  //   }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
