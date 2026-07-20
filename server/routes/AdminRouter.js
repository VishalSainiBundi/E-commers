const express = require("express");
const { login, register } = require("../controllers/AdminController");
const { verifySuperAdmin } = require("../middleware/AdminAuth");

const router = express.Router();

// Admin Login
router.post("/login", login);
// Admin Register
router.post("/register", verifySuperAdmin, register);

module.exports = router;
