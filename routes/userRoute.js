const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
} = require("../controllers/userController");

const { auth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUserInfo);

module.exports = router;