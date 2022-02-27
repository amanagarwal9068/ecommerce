const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin signin
exports.signin = async (req, res) => {
  try {
    let admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      // Checking Admin exists or not
      return res.status(400).json({ error: "No Admin found." });
    }

    // Matching password
    if (bcrypt.compareSync(req.body.password, admin.password)) {
      // Creating payload for JWT token
      const payload = {
        id: admin._id,
        username: admin.username,
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

// Add new admin
exports.addAdmin = async (req, res) => {
  // Only root admin can add other admins
  try {
    if (req.admin.username === "root") {
      let admin = await Admin.findOne({ username: req.body.username });

      if (admin) {
        // Checking if username is already taken
        return res.status(200).json({ message: "Username is already taken." });
      } else {
        // Doing signup process
        req.body.password = bcrypt.hashSync(req.body.password, 10); // Hashing password
        let newAdmin = new Admin(req.body);
        await newAdmin.save();
        return res
          .status(200)
          .json({ message: "New account is created, login to get token." });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Access allowed only to root admin." });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Add new products
exports.addProducts = async (req, res) => {
  try {
    await Product.insertMany(req.body);
    return res.status(200).json({ message: "Success." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    let results = await Order.find();
    if (results.length) return res.status(200).json(results);
    else return res.status(200).json({ message: "No order is placed yet." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
