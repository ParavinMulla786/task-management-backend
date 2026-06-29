const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= Register =================
const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Default image if no image is uploaded
 const imgPath = req.file
  ? `/uploads/users/${req.file.filename}`
  : `/uploads/users/Defaultpic.jpg`;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      imgPath,
    });

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
      data: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// ================= Login =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "User does not exist",
      });
    }

    const isPassCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!isPassCorrect) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        role: existingUser.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      data: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// ================= View Profile =================
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (user.imgPath) {
      user.imgPath = `http://localhost:5005${user.imgPath}`;
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// ================= Get All Users =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


// ================= Update Profile =================
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const { name, contactNumber } = req.body;

    user.name = name || user.name;
   
    user.contactNumber = contactNumber || user.contactNumber;

    if (req.file) {
      user.imgPath = `/uploads/users/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Profile Updated Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


// ================= Delete User =================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  getAllUsers,
  deleteUser,
  updateUser,
};