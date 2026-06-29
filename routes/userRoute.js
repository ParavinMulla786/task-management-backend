const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserInfo,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const { auth } = require("../middleware/auth");
const uploadImage = require("../middleware/multer");

// Register
router.post(
  "/register",
  uploadImage.single("image"),
  register
);

// Login
router.post("/login", login);

// Profile
router.get("/profile", auth, getUserInfo);

// Update Profile
router.put(
  "/update",
  auth,
  uploadImage.single("image"),
  updateUser
);

// Get All Users
router.get("/allusers", getAllUsers);

// Delete User
router.delete("/deleteUser", auth, deleteUser);

module.exports = router;