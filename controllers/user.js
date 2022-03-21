const User = require("../models/user");
const jwt = require("jsonwebtoken");
const accessTokenKey = process.env.JWT_KEY;

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      fullname: req.body.fullname.trim(),
    });
    user.generatePassword(req.body.password);
    await user.save().then(
      (user) => {
        console.olog("---------------------------------------")
        console.log("User signed up");
        console.log("Username: "+ user.username);
        console.log("Fullname: " + user.fullname);
        console.olog("---------------------------------------")
        return res.status(200).json({ msg: "Đăng ký thành công" });
      },
      (err) => {
        return res.status(409).json({ msg: "Tài khoản đã tồn tại!" });
      }
    );
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: err });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.username) return res.status(422).json({ msg: "Hãy nhập tên đăng nhập" });
    if (!req.body.password) return res.status(422).json({ msg: "Hãy điền mật khẩu" });
    const user = await User.findOne({ username: req.body.username });
    if (user == null) return res.status(401).json({msg: "Thông tin đăng nhập không hợp lệ"});
    if (!user.checkValidPassword(req.body.password)) {
      return res.status(401).json({ msg: "Thông tin đăng nhập không hợp lệ" });
    }
    const jwtToken = user.generateJWT();
    const userData = await User.findOne({ username: req.body.username }, '-verifyCode -password -__v');
    console.olog("---------------------------------------")
    console.log("User logged in");
    console.log("Username: "+ userData.username);
    console.log("Fullname: " + userData.fullname);
    console.olog("---------------------------------------")
    return res.status(200).json({
      user: userData,
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({msg: err});
  }
  
};

exports.autoLogin = async (req, res) => {
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
    const user = await User.findById(decodedToken.userId,'-password -__v');
    console.olog("---------------------------------------")
    console.log("User autologin");
    console.log("Username: "+ user.username);
    console.log("Fullname: " + user.fullname);
    console.olog("---------------------------------------")
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ msg: "Phiên đăng nhập đã hết hạn!" });
      }
  } catch (err) {
    console.error(err);
    return res.status(401).json({msg: "Phiên đăng nhập đã hết hạn!"})
  }

};