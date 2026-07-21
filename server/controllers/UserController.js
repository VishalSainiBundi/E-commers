require("dotenv").config();
const message = require("../message");
const userModel = require("../model/userModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRETKEY);
const { createToken } = require("../helper/helper");

// ── REGISTER ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).send({
        msg: "Name, valid email and a password of at least 6 characters are required",
        flag: 1,
      });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.send({ msg: "An account with this email already exists", flag: 1 });
    }

    const encryptedPass = cryptr.encrypt(password);
    await userModel.create({ name, email, password: encryptedPass });

    return res.send({ msg: "Account created successfully", flag: 0 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    return res.send(message.catch_error);
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ msg: "Email and password are required", flag: 1 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({ msg: "Account does not exist", flag: 1 });
    }

    const decryptedPass = cryptr.decrypt(user.password);
    if (decryptedPass !== password) {
      return res.send({ msg: "Incorrect password", flag: 1 });
    }

    const token = createToken({ ...user.toJSON(), password: null });
    return res.send({
      msg: "Login successful",
      flag: 0,
      user: { ...user.toJSON(), password: null },
      token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    return res.send(message.catch_error);
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    return res.send({ msg: "Logout successful", flag: 0 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    return res.send(message.catch_error);
  }
};

module.exports = { register, login, logout };
