const { createToken } = require("../helper/helper");
const AdminModel = require("../model/AdminModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRETKEY || "1234567890abcdef");

const register = async (req, res) => {
  try {
    // Add your registration logic here
    const { admin_type, name, email, password } = req.body;
    const adminExist = await AdminModel.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ msg: "Admin already exists", flag: 0 });
    }
    const encryptedPass = cryptr.encrypt(password);
    const newAdmin = new AdminModel({ admin_type, name, email, password: encryptedPass });
    await newAdmin.save();
    res.status(201).json({ msg: "Admin registered successfully", flag: 0 });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ flag: 1, msg: error.message+"REgister" });
  }
};

const login = async (req, res) => {
  try {
    // Add your login logic here
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Admin does not exist" });
    }
    const decryptedPass = cryptr.decrypt(admin.password);
    if (decryptedPass !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    } else {
      const token = createToken({ ...admin.toJSON(), password: null });
      // set token in cookie
      res.cookie("admin_token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("admin", JSON.stringify({ ...admin.toJSON(), password: null }), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ msg: "Admin Login", admin: { ...admin.toJSON(), password: null }, token, flag: 0 });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message, flag: 1 });
  }
};

module.exports = {
  register,
  login,
};
