const Product = require("../models/Product");

// View products
exports.viewProducts = async (req, res) => {
  try {
    // Fetching only those results whose quantity is greater than and equal to 1
    let results = await Product.find({ quantity: { $gte: 1 } });
    if (results.length) return res.status(200).json(results);
    else
      return res.status(200).json({ message: "All products have been sold" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
