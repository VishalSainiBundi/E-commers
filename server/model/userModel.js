const mongoose = require("mongoose");

const ShippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },            // recipient name
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    contact: { type: String, default: null },       // fixed typo: contect → contact
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    shipping_address: {
      type: [ShippingAddressSchema],
      default: [],
    },
    default_address: {
      type: Number,
      default: 0,
    },
    // ── OTP fields (Part 2) ───────────────────────────────────────────────────
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpRequestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
