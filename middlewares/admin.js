const jwt = require("jsonwebtoken");

// Middleware for securing APIs
exports.isAdminSignin = (req, res, next) => {
  let admin;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ error: "Auth token is expired." });
    }
  }

  if (!admin) {
    return res.status(400).json({ error: "Auth token not found." });
  }
  req.admin = admin;

  next();
};
