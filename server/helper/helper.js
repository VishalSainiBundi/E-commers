const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

function generateUniqueImageName(originalName) {
  const ext = originalName.substring(originalName.lastIndexOf("."));
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
}

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const verifytoken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  razorInstance,
  generateUniqueImageName,
  createToken,
  verifytoken,
};