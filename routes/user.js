const router = require("express").Router();
const userController = require("../controllers/user");
const orderController = require("../controllers/order");
const multer = require("multer");

const { isUserSignin } = require("../middlewares/user");

// Uploading image to server
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "controllers/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload = multer({ storage: storage });

// Routing
router.post("/signup", upload.single("profilePhoto"), userController.signup); //Signup
router.post("/signin", userController.signin); // Signin
router.get("/profile", isUserSignin, userController.getMyProfile); // Get my profile
router.post(
  "/profile",
  upload.single("profilePhoto"),
  isUserSignin,
  userController.editMyProfile
); // Edit my profile
router.delete("/profile", isUserSignin, userController.deleteMyProfile); // Delete my profile

router.post("/order", isUserSignin, orderController.orderAProduct); // Order a new prodcut
router.get("/order", isUserSignin, orderController.getMyOrders); // Get all my orders

module.exports = router;
