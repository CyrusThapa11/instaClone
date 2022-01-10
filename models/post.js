const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "user",
  },
  likes: [{ type: ObjectId, ref: "user" }],
  comments: [{ text: String, postedBy: { type: ObjectId, ref: "user" } }],
});

const Posts = mongoose.model("post", postSchema);
module.exports = Posts;
