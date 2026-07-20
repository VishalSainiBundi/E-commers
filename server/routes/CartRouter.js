const express = require("express");
const { syncCart } = require("../controllers/CartController");

const CartRouter = express.Router();

CartRouter.post("/sync-cart", syncCart);

module.exports = CartRouter;
