const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", getUserInfo);

module.exports = router;