const messages = require("../message");
const wishModel = require("../model/wishModel");

const wishCart = async (req, res) => {
  try {
    const { user_id, cart_data } = req.body;

    if (!user_id || !Array.isArray(cart_data)) {
      return res.status(400).send({ msg: "Invalid wishlist data", flag: 1 });
    }

    for (const item of cart_data) {
      const product_id = item.id || item._id;
      if (!product_id) continue;
      await wishModel.findOneAndUpdate(
        { user_id, product_id },
        { $setOnInsert: { quantity: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const finalwishCart = await wishModel.find({ user_id: user_id }).populate({
      path: "product_id",
      select: "name thumbnail final_price original_price",
    });

    res.send({
      finalwishCart,
      msg: "",
      flag: 0,
    });

  } catch (error) {
    console.log(error.message);
    res.send(messages.catch_error);
  }
};

module.exports = {
  wishCart,
};
