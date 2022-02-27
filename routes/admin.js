const router = require("express").Router();
const adminController = require("../controllers/admin");

const { isAdminSignin } = require("../middlewares/admin");

router.post("/signin", adminController.signin); // Admin Signin
router.post("/add-admin", isAdminSignin, adminController.addAdmin); // Add new admin account
router.post("/add-products", isAdminSignin, adminController.addProducts); // Add new products
router.get("/order", isAdminSignin, adminController.getAllOrders); // Get all orders

module.exports = router;
