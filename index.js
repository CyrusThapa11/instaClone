const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const { MongoClient } = require("mongodb");
const  {mongourl}  = require("./config/keys.js");
const Posts = require("./models/post");

console.log('mongourl--',mongourl);

// requiring routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db connection :

require("./models/user");

// const url =
//   "mongodb+srv://vinsmokecyrus:K1jK9OZJU1mPLyln@cluster0.y0yfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongourl);
mongoose.connection.on("connected", () => {
  console.log("yes");
});
mongoose.connection.on("error", (err) => {
  console.log("error   ", err);
});

// routes :
const postsRoute = require("./routes/posts");
const userRoute = require("./routes/auth");
app.use("/user", userRoute);
app.use("/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("Hi bois");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  })
}

app.listen(PORT, () => {
  console.log(`running on : http://localhost:${PORT}/`);
});
