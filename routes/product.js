const router = require("express").Router();
const productController = require("../controllers/product");

router.get("/", productController.viewProducts); // Get all products

module.exports = router;
