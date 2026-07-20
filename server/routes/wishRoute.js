const express = require("express");
const { wishCart } = require("../controllers/wishController");

const wishRouter = express.Router();

wishRouter.post("/sync-wishlist", wishCart);

module.exports = wishRouter;
