const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware for securing APIs
exports.isUserSignin = async (req, res, next) => {
  let user;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      let userTest = await User.findOne({ _id: user.id });
      if (!userTest) return res.status(400).json({ error: "Invalid token." });
    } catch {
      return res.status(400).json({ error: "Auth token is expired." });
    }
  }

  if (!user) {
    return res.status(400).json({ error: "Auth token not found." });
  }
  req.user = user;

  next();
};
