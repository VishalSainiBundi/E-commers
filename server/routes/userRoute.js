const express = require("express");
const { register, login, logout } = require("../controllers/UserController");
const { sendOtp, verifyOtp, resendOtp } = require("../controllers/OtpController");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);

UserRouter.post("/send-otp",   sendOtp);
UserRouter.post("/verify-otp", verifyOtp);
UserRouter.post("/resend-otp", resendOtp);  // token-authenticated resend

module.exports = UserRouter;
