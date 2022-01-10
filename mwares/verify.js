const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: " you cant login !" });
  }

  // authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX2lkIjoiNjFkNmFmOTI0MDcwMWJlMDk5YWM1NGI4IiwiaWF0IjoxNjQxNDY0NTA5fQ.I0ck4Q4eC6WMHyzRroL81KMdj-CNnLpVYe0vak4yKeY
  // console.log("authorization", authorization);

  // token_ 1 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX2lkIjoiNjFkNmFmOTI0MDcwMWJlMDk5YWM1NGI4IiwiaWF0IjoxNjQxNDY0NTA5fQ.I0ck4Q4eC6WMHyzRroL81KMdj-CNnLpVYe0vak4yKeY
  const token_ = authorization.split(" ")[1];

  // console.log("token_ 1", token_);
  //   token_ = token_.slice(1);

  jwt.verify(token_, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "jwt token leke aa phele" });
    }

    // payload is :
    // payload->  { __id: '61d6af9240701be099ac54b8', iat: 1641464509 }
    // console.log("payload-> ", payload);
    const { __id } = payload;

    // User.findById(__id)
    //   .then((userdata) => {
    //     req.user = userdata;
    //     console.log("userdata-> ", userdata);
    //   })
    //   .catch((err) => {
    //     console.log("errorss->", err);
    //   });
    const user_ = await User.findById(__id);
    req.user = user_;
    next();
  });
};
