const userModel  = require("../model/userModel");
const { verifytoken } = require("../helper/helper");
const message    = require("../message");

// ── helper: get userId from JWT in Authorization header ───────────────────────
const getUserId = (req) => {
  const token   = req.headers.authorization;
  const decoded = verifytoken(token);
  return decoded?._id || null;
};

// ── POST /address/add ─────────────────────────────────────────────────────────
const addAddress = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).send({ msg: "Unauthorized", flag: 1 });

    const { name, addressLine1, addressLine2, contact, city, state, country, pincode } = req.body;

    if (!addressLine1 || !city || !state || !country || !pincode)
      return res.status(400).send({ msg: "addressLine1, city, state, country, pincode are required", flag: 1 });

    if (pincode && !/^\d{6}$/.test(pincode))
      return res.status(400).send({ msg: "Pincode must be 6 digits", flag: 1 });

    if (contact && !/^\d{10}$/.test(contact))
      return res.status(400).send({ msg: "Contact must be a 10-digit number", flag: 1 });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ msg: "User not found", flag: 1 });

    user.shipping_address.push({ name: name || "", addressLine1, addressLine2: addressLine2 || "", contact: contact || null, city, state, country, pincode });

    // If this is the first address, make it the default
    if (user.shipping_address.length === 1) user.default_address = 0;

    await user.save();

    const updated = await userModel.findById(userId).lean();
    return res.send({
      msg:              "Address added successfully",
      flag:             0,
      shipping_address: updated.shipping_address,
      default_address:  updated.default_address,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("addAddress:", error);
    return res.send(message.catch_error);
  }
};

// ── GET /address/list ─────────────────────────────────────────────────────────
const listAddresses = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).send({ msg: "Unauthorized", flag: 1 });

    const user = await userModel.findById(userId).lean();
    if (!user) return res.status(404).send({ msg: "User not found", flag: 1 });

    return res.send({
      flag:             0,
      shipping_address: user.shipping_address,
      default_address:  user.default_address,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("listAddresses:", error);
    return res.send(message.catch_error);
  }
};

// ── PUT /address/edit/:index ──────────────────────────────────────────────────
const editAddress = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).send({ msg: "Unauthorized", flag: 1 });

    const index = parseInt(req.params.index, 10);
    const { name, addressLine1, addressLine2, contact, city, state, country, pincode } = req.body;

    if (!addressLine1 || !city || !state || !country || !pincode)
      return res.status(400).send({ msg: "addressLine1, city, state, country, pincode are required", flag: 1 });

    if (pincode && !/^\d{6}$/.test(pincode))
      return res.status(400).send({ msg: "Pincode must be 6 digits", flag: 1 });

    if (contact && !/^\d{10}$/.test(contact))
      return res.status(400).send({ msg: "Contact must be a 10-digit number", flag: 1 });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ msg: "User not found", flag: 1 });

    if (index < 0 || index >= user.shipping_address.length)
      return res.status(400).send({ msg: "Invalid address index", flag: 1 });

    user.shipping_address[index] = {
      name:         name || "",
      addressLine1,
      addressLine2: addressLine2 || "",
      contact:      contact || null,
      city,
      state,
      country,
      pincode,
    };

    await user.save();

    const updated = await userModel.findById(userId).lean();
    return res.send({
      msg:              "Address updated successfully",
      flag:             0,
      shipping_address: updated.shipping_address,
      default_address:  updated.default_address,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("editAddress:", error);
    return res.send(message.catch_error);
  }
};

// ── DELETE /address/delete/:index ─────────────────────────────────────────────
const deleteAddress = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).send({ msg: "Unauthorized", flag: 1 });

    const index = parseInt(req.params.index, 10);

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ msg: "User not found", flag: 1 });

    if (index < 0 || index >= user.shipping_address.length)
      return res.status(400).send({ msg: "Invalid address index", flag: 1 });

    user.shipping_address.splice(index, 1);

    // Fix default_address if it now points past the end
    if (user.default_address >= user.shipping_address.length) {
      user.default_address = Math.max(0, user.shipping_address.length - 1);
    }

    await user.save();

    const updated = await userModel.findById(userId).lean();
    return res.send({
      msg:              "Address deleted successfully",
      flag:             0,
      shipping_address: updated.shipping_address,
      default_address:  updated.default_address,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("deleteAddress:", error);
    return res.send(message.catch_error);
  }
};

// ── PUT /address/set-default/:index ───────────────────────────────────────────
const setDefaultAddress = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).send({ msg: "Unauthorized", flag: 1 });

    const index = parseInt(req.params.index, 10);

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ msg: "User not found", flag: 1 });

    if (index < 0 || index >= user.shipping_address.length)
      return res.status(400).send({ msg: "Invalid address index", flag: 1 });

    user.default_address = index;
    await user.save();

    const updated = await userModel.findById(userId).lean();
    return res.send({
      msg:              "Default address updated",
      flag:             0,
      shipping_address: updated.shipping_address,
      default_address:  updated.default_address,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("setDefaultAddress:", error);
    return res.send(message.catch_error);
  }
};

module.exports = { addAddress, listAddresses, editAddress, deleteAddress, setDefaultAddress };
