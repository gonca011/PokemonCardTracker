const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.post("/data", (req, res) => {
  res.status(410).json({
    error: "O endpoint /api/data foi substituido pela API persistente de utilizadores.",
  });
});

router.get("/data", (req, res) => {
  res.status(410).json({
    error: "O endpoint /api/data foi substituido pela API persistente de utilizadores.",
  });
});

module.exports = router;
