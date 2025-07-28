const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id || decoded.userDetails?.id;

      if (decoded) {
        req.user = await Users.findById(userId);
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }

      next();
    } catch(err) {
      console.error(err);
      return res.status(403).json({ message: "Forbidden" });
    }
  },
};

module.exports = authMiddleware;
