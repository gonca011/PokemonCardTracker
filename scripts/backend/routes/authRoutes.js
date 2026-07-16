const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/google", asyncHandler(authController.googleLogin));

module.exports = router;
