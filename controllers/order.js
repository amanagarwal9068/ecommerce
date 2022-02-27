const Product = require("../models/Product");
const Order = require("../models/Order");

// Order a product
exports.orderAProduct = async (req, res) => {
  try {
    // Reducing product's quantity by 1
    let product = await Product.findOne({ _id: req.body.productId });
    product.quantity -= 1;

    // Adding to orders collection
    let order = new Order({
      _user: req.user.id,
      _product: req.body.productId,
    });

    await order.save();
    await product.save();
    
    return res.status(200).json({message:"Order placed, successfully."});
    } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    let results = await Order.find({ _user: req.user.id }).populate("_product",{quantity:0});
    if (results.length) return res.status(200).json(results);
    else return res.status(200).json({ message: "You have ordered nothing yet." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
