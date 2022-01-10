const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: ObjectId, ref: "user" }],
  following: [{ type: ObjectId, ref: "user" }],
  profile: {
    type: String,
    default:"https://res.cloudinary.com/vinsmokecyrus/image/upload/v1641790545/profile-picture_yzvbft.jpg"
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
