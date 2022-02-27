const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let fs = require("fs");
let path = require("path");

// Registering a user
exports.signup = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      // Checking if username is already taken
      return res.status(200).json({ message: "Username is already taken." });
    } else {
      // Doing signup process
      req.body.password = bcrypt.hashSync(req.body.password, 10); // Hashing password
      let newUser = new User(req.body);

      // Reading file from server
      newUser.profilePhoto = {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      };

      await newUser.save();

      // Deleting file from server after being stored in database
      fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));

      // Payload for JWT token
      const payload = {
        id: newUser._id,
        email: newUser.email,
      };

      // Creating JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        token,
      });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Signing in a user
exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.email });
    if (!user) {
      // Checking user exists or not
      return res.status(400).json({ error: "No user found." });
    }

    // Matching password
    if (bcrypt.compareSync(req.body.password, user.password)) {
      // Creating payload for JWT token
      const payload = {
        id: user._id,
        username: user.username,
      };

      // Creating JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        token,
      });
    } else {
      // Wrong password
      return res.status(403).json({ error: "Wrong password." });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// View profile
exports.getMyProfile = async (req, res) => {
  try {
    return res
      .status(200)
      .json(await User.findOne({ _id: req.user.id }, { password: 0 }));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Edit profile
exports.editMyProfile = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    user.name = req.body.name;
    user.mobile = req.body.mobile;

    // Reading file from server
    user.profilePhoto = {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    };

    await user.save();

    // Deleting file from server after being stored in database
    fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));

    return res.status(200).json({ message: "Profile is updated." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Delete profile
exports.deleteMyProfile = async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.user.id });
    return res.status(200).json({ message: "Profile is deleted." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
