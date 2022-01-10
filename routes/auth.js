const router = require("express").Router();
const User = require("../models/user");
const Posts = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const verify = require("../mwares/verify");


router.post("/signup", async (req, res) => {
  const { name, email, password,profile } = req.body;
  // console.log(name, email);

  if (!email || !password || !name) {
    return res.status(422).json({ error: "Add all the fields" });
  }

  // this will give the object user !
  const result = await User.findOne({ email: email });
  // console.log(result);

  if (result === null || result === undefined) {
    // hash and store
    bcrypt
      .hash(password, 12)
      .then(async (hashedpass) => {
        const user = new User({
          name,
          email,
          password: hashedpass,
          profile
        });

        // this is causing error  !!:
        // save the user :
        // user
        //   .save()
        //   .then((user) => {
        //     return res.json({ message: "Saved successfully" });
        //   })
        //   .catch((err) => {
        //     console.log("error ", err);
        //   });

        await user.save();
      })
      .catch((err) => {
        console.log("errors is ", err);
      });
  } else {
    return res.status(422).json({ error: "user already exits " });
  }
  res.json({ message: "success" });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter full details" });
  }
  // then find the user !
  User.findOne({ email: email })
    .then((oldUser) => {
      if (!oldUser) {
        return res.status(422).json({
          error: "invalid credentials",
        });
      }
      bcrypt
        .compare(password, oldUser.password)
        .then((didMatch) => {
          if (didMatch) {
            // console.log("JWT_SECRET : ", JWT_SECRET);
            //   didMatch -> rue
            // console.log("didMatch: ", didMatch);
            // console.log("oldUser._id: ", oldUser._id);
            // return res.json({ message: "signed in successfully !!" });
            const token = jwt.sign({ __id: oldUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following,profile } = oldUser;
            return res.json({
              token,
              user: { _id, name, email, followers, following ,profile},
            });
          } else {
            return res.status(422).json({ error: "inValid credentials !!" });
          }
        })
        .catch((err) => {
          console.log("error is :", err);
        });
    })
    .catch((err) => {
      console.log("err is ", err);
    });
});

router.get("/protected", verify, (req, res) => {
  console.log("welcome bitch !!");
  // console.log(res.user);
  res.json({ message: "successfully logged in" });
});

router.get("/showuser/:id", verify, (req, res) => {
  console.log("id--", req.params.id);

  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      // find posts created by user :
      Posts.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          console.log("posts ", posts);
          return res.json({ user, posts });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/follow", verify, (req, res) => {
  console.log("follow-->", req.body.followedId);
  User.findByIdAndUpdate(
    req.body.followedId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      console.log("err--> ", err, "result --", result);
      if (err) {
        return res
          .status(422)
          .json({ error: err, message: "Something went wrong" });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { following: req.body.followedId },
          },
          { new: true }
          // (err, result) => {
          //   console.log("err -> ", err);
          // }
        )
          .select("-password")
          .then((result) => res.json(result))
          .catch((err) => {
            return res.status(422).json({ error: err, message: "Error !" });
          });
      }
    }
  );
});

router.put("/unfollow", verify, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowedId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      console.log("err--> ", err, "result --", result);
      if (err) {
        return res
          .status(422)
          .json({ error: err, message: "Something went wrong" });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.unfollowedId },
          },
          { new: true }
          // (err, result) => {
          //   console.log("err -> ", err);
          // }
        )
          .select("-password")
          .then((result) => res.json(result))
          .catch((err) => {
            return res.status(422).json({ error: err, message: "Error !" });
          });
      }
    }
  );
});

router.put('/updateprofile',verify, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set: {
      profile: req.body.profile
    }
  }, { new: true }, (err, result) => {
    if (err) return res.status(422).json({ message: "Could not update the profile !!", err })
    return res.json({ message: "Profile Updated !!",result})
  })
  
})

module.exports = router;
