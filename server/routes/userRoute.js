const express = require('express');
const { register, login, logout } = require('../controllers/UserController');

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);

module.exports = UserRouter;
