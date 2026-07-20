const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

CartSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;
