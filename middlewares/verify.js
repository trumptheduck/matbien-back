const User = require("../models/user");
const jwt = require("jsonwebtoken");
const accessTokenKey = process.env.JWT_KEY;

exports.verifyUser = async (req, res, next) => {
  try {
    if (!req.headers['authorization']?.length||req.headers['authorization'].length < 8) {
      return res.status(403).json({msg: "Truy cập không cho phép!"})
    }
    const jwtToken = req.headers['authorization'].slice(7);
    if (!jwt||jwtToken===null||jwtToken===undefined) {
      return res.status(403).json({msg: "Truy cập không cho phép!"})
    }
    const decodedToken = jwt.verify(jwtToken, accessTokenKey);
    if (decodedToken === null) {
      console.log(decodedToken);
        return res.status(403).json({msg: "Truy cập không cho phép!"})
    }
    User.findOne({ _id: decodedToken?.userId }).exec((err, user) => {
      if (err) {
        console.log(err)
        return res.status(403).json({msg: "Truy cập không cho phép!"})
      }
      if (user) {
        res.locals.user = user;
        next()
      }
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({msg: "Lỗi máy chủ!"})
  }};
