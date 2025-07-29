const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
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
  googleAuth: async (req, res) => {
    // console.log("Google Auth called" , req.body);
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "invalid request" });
    }

    try {
      const googleClinet = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const response = await googleClinet.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });

      const payload = response.getPayload();

      const { sub: googleId, email } = payload;

      let data = await Users.findOne({ email: email });

      if (!data) {
        //create new user
        data = new Users({
          email: email,
          isGoogleUser: true,
          googleId: googleId,
        });

        await data.save();
      }

      const userDetails = {
        id: data._id ? data._id : googleId,
        email: data.email,
      };

      const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "User authenticated",token :  token , userDetails: userDetails });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verify : async(req, res) => {
    return res.status(200).json({ success: true, user: req.user})
  }
};

module.exports = authController;
