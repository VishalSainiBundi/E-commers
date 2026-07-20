const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const OrderModel = require("../model/OrderModel");
const userModel = require("../model/userModel");
const { razorInstance } = require("../helper/helper");
const crypto = require("crypto");

// ---------------- Create Order ----------------
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      paymentMode,
      totalAmount,
      shippingAddress,
      productDetails,
    } = req.body;

    if (!userId || !productDetails || productDetails.length === 0) {
      return res.status(400).send({ msg: "Invalid order data", flag: 1 });
    }

    // ✅ FIX: ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ msg: "Invalid userId", flag: 1 });
    }

    const formattedProducts = productDetails.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      final_price: item.final_price,
      original_price: item.original_price,
      imgUrl: item.imgUrl,
    }));

    const order = new OrderModel({
      userId: new mongoose.Types.ObjectId(userId), // ✅ FIX
      product_details: formattedProducts,
      totalAmount: Number(totalAmount), // ✅ FIX
      paymentMode,
      shippingAddress,
      orderStatus: 1,
      orderStatusHistory: [{ status: 1 }],
      is_free_shipping: Number(paymentMode) !== 0,
    });

    await order.save();

    // COD
    if (Number(paymentMode) === 0) {
      await CartModel.deleteMany({
        user_id: new mongoose.Types.ObjectId(userId), // ✅ FIX
      });

      return res.status(200).send({
        msg: "Order placed",
        order_id: order._id,
        flag: 0,
      });
    }

    // ✅ FIX: razorInstance safety
    if (!razorInstance || !razorInstance.orders) {
      throw new Error("Razorpay instance not initialized");
    }

    const options = {
      amount: Math.round(Number(totalAmount) * 100), // ✅ FIX
      currency: "INR",
      receipt: "order-" + order._id,
    };

    const razorpay_order = await razorInstance.orders.create(options);

    // ✅ FIX: check response
    if (!razorpay_order || !razorpay_order.id) {
      throw new Error("Failed to create Razorpay order");
    }

    order.razor_pay_order_id = razorpay_order.id;
    await order.save();

    return res.status(200).send({
      msg: "Proceed to payment",
      flag: 0,
      razorpay_order_id: razorpay_order.id,
      order_id: order._id,
    });

  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).send({
      msg: "Something went wrong",
      flag: 1,
      error: error.message,
    });
  }
};


// ---------------- Get User Orders ----------------
const getUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ FIX: ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.send({ msg: "Invalid userId", flag: 1 });
    }

    const orders = await OrderModel.find({
      userId: new mongoose.Types.ObjectId(userId), // ✅ FIX
    }).sort({ createdAt: -1 });

    res.send({ orders, flag: 0 });
  } catch (error) {
    console.error("Get user order error:", error);
    res.send({ msg: "Something went wrong on server", flag: 1 });
  }
};


// ---------------- Verify Payment ----------------
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    // ✅ FIX: ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.send({ msg: "Invalid order id", flag: 1 });
    }

    const order = await OrderModel.findById(order_id);
    if (!order) return res.send({ msg: "Order not found", flag: 1 });

    // ✅ FIX: check secret
    if (!process.env.RAZORPAY_API_SECRET) {
      throw new Error("Razorpay secret missing");
    }

    // Generate signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id) // ✅ FIX
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      order.paymentStatus = 1;
      await order.save();

      await CartModel.deleteMany({ user_id: order.userId });

      // ✅ FIX: await async function
      await sendOrderConfirmationEmail(order);

      return res.send({
        msg: "Payment verified successfully",
        flag: 0,
        order_id: order._id,
      });
    } else {
      return res.send({ msg: "Payment verification failed", flag: 1 });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.send({ msg: "Something went wrong on server", flag: 1 });
  }
};


// ---------------- Placeholder Functions ----------------
const getOrderById = (req, res) => {};
const updateOrder = (req, res) => {};
const deleteOrder = (req, res) => {};
const getAllOrders = (req, res) => {};


// ---------------- Email Function ----------------
const sendOrderConfirmationEmail = async (order) => {
  try {
    const user = await userModel.findById(order.userId);
    if (user?.email) {
      console.log(`Send email to ${user.email} for order ${order._id}`);
    }
  } catch (err) {
    console.error("Email error:", err);
  }
};


// ---------------- Exports ----------------
module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getUserOrder,
  verifyPayment,
};