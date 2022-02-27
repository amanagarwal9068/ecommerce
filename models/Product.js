const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Shirts", "Tshirts"],
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
