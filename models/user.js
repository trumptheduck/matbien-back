const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const accessTokenKey = process.env.JWT_KEY;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, lowercase: true, require: true, unique: true },
    password: { type: String, require: true },
    fullname: { type: String, require: true },
  },
  {
    collection: "users",
  }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      username: this.username,
      userId: this._id
    },
    accessTokenKey,
  );
};

userSchema.methods.generatePassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.verifyToken = function (token) {
  return jwt.verify(token,accessTokenKey);
};

userSchema.methods.checkValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);