const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config();
// Register
const register = async (req, res) => {
  try {
    let { name, email, password, contactNumber } = req.body;

    // Check all fields
    if (!name || !email || !password || !contactNumber) {
      return res.status(400).send({
        success: false,
        msg: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        msg: "User already exists",
      });
    }

    // Hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
    });

    res.status(201).send({
      success: true,
      msg: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        msg: "User does not exist",
      });
    }

    const isPassCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!isPassCorrect) {
      return res.status(401).send({
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

    res.status(200).send({
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
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
};

// View Profile
const getUserInfo = async (req, res) => {
  try {
    console.log("Logged In User:", req.user);

    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      data: user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      msg: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  getAllUsers,
};