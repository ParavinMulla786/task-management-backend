const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
  getAllUsers,
} = require("../controllers/userController");

const { auth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUserInfo);
router.get("/allusers",getAllUsers);

module.exports = router;