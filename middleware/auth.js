const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        msg: "Please login",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        msg: "Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      msg: "Invalid or expired token",
    });
  }
}

function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).send({
      success: false,
      msg: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      msg: "Admin access required",
    });
  }

  next();
}

module.exports = { auth, admin };