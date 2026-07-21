const express = require("express");
const { register, login, logout } = require("../controllers/UserController");
const { sendOtp, verifyOtp } = require("../controllers/OtpController");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);

// OTP endpoints
UserRouter.post("/send-otp", sendOtp);
UserRouter.post("/verify-otp", verifyOtp);

module.exports = UserRouter;
