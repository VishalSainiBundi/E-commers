const messages = require("../message");
const CartModel = require("../model/CartModel");

const syncCart = async (req, res) => {
  try {
    const { user_id, cart_data } = req.body;
    if (!user_id || !Array.isArray(cart_data)) {
      return res.status(400).send({ msg: "Invalid cart data", flag: 1 });
    }

    for (const item of cart_data) {
      const product_id = item.id || item._id;
      const quantity = Number(item.qty);
      if (!product_id || !Number.isInteger(quantity) || quantity < 1) continue;

      await CartModel.findOneAndUpdate(
        { user_id, product_id },
        { $inc: { quantity } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    const finalCart = await CartModel.find({ user_id: user_id }).populate({
      path: "product_id",
      select: "name final_price original_price thumbnail",
    });
    return res.send({
      finalCart,
      msg: "",
      flag: 0,
    });
  } catch (error) {
    console.log(error.message);
    res.send(messages.catch_error);
  }
};

module.exports = {
  syncCart,
};
