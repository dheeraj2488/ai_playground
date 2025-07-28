const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }


      const data = await Users.findOne({ email });

      if (!data) {
        return res
          .status(401)
          .json({ message: "Invalid email or password, user not found" });
      }

      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userDetails = {
        id: data._id,
        email: data.email,
      };

      const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: userDetails,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = new Users({
        email,
        password: encryptedPassword,
      });

      await user.save();

      const userDetails = {
        id: user._id,
        email: user.email,
      };

      res.status(200).json({
        message: "User registered successfully",
        user: userDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
