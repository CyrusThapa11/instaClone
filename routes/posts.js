const router = require("express").Router();
const Posts = require("../models/post");
const verify = require("../mwares/verify");

router.post("/createpost", verify, async (req, res) => {
  const { title, body, photo } = req.body;
  console.log("title->> ", title, "body -->", body, "body-->", photo);
  if (!title || !body || !photo) {
    return res.status(422).json({ error: "Enter all the details" });
  }
  console.log("req.user -> ", req.user);

  const post = new Posts({
    title,
    body,
    photo,
    postedBy: req.user._id,
  });

  const result = await post.save();
  // console.log("result", result);

  return res.send("created a post !");
});

router.get("/allposts", verify, async (req, res) => {
  // to get only name and _id
  const result = await Posts.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");

  //   console.log("result", result);
  res.json(result);
});

router.get("/followingposts", verify, async (req, res) => {
  // to get only name and _id

  const result = await Posts.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");

  //   console.log("result", result);
  res.json(result);
});

router.get("/myposts", verify, async (req, res) => {
  const result = await Posts.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );

  //   console.log("result", result);
  res.json(result);
});

router.put("/like", verify, (req, res) => {
  Posts.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  ).exec((err, res_) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(res_);
    }
  });
});

router.put("/unlike", verify, (req, res) => {
  Posts.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  ).exec((err, res_) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(res_);
    }
  });
});

router.put("/comment", verify, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  // console.log("text --", text);
  // console.log("comment --", comment);

  Posts.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .exec((err, res_) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(res_);
      }
    });
});

router.delete("/deletepost/:postId", verify, (req, res) => {
  Posts.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      console.log("req.user->", req.user);
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((res_) => {
            res.json({ message: "Deleted sccessfully", id: res_ });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
