const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check token exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        msg: "Token not provided",
      });
    }

    // 2. Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        msg: "Invalid token format (Use Bearer token)",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 5. Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);

    return res.status(401).send({
      success: false,
      msg: "Invalid or expired token",
    });
  }
}

//
// OPTIONAL: Admin Middleware
//
function admin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        msg: "Access denied (Admin only)",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Error:", error.message);

    return res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}

module.exports = { auth, admin };