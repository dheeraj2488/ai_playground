const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/login' , authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/google-auth', authController.googleAuth);
router.get("/verify", authMiddleware.verifyToken, authController.verify);

module.exports = router;