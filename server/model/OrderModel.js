const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },

    product_details: [
      {
        id: { type: Schema.Types.ObjectId, ref: "product", required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        final_price: { type: Number, required: true },
        original_price: { type: Number, required: true },
        imgUrl: { type: String, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    shippingAddress: {
      name: { type: String, required: true },
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
      contact: { type: String, default: null },
    },

    paymentMode: { type: Number, enum: [0, 1], required: true }, // 0: COD, 1: Online
    paymentStatus: { type: Number, enum: [0, 1], default: 0 }, // 0: Pending, 1: Completed
    orderStatus: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], default: 0 },
    orderStatusHistory: [
      {
        status: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    is_free_shipping: { type: Boolean, default: true },
    razor_pay_order_id: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);