const message = require("../message");
const { verifytoken } = require("../helper/helper");

const verifyWebsiteUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ msg: "Unauthorized access", flag: 1 });
    }

    if (verifytoken(token) != null) {
      return next();
    } else {
      return res.status(401).send({ msg: "Unauthorized access", flag: 1 });
    }
  } catch (error) {
    return res.send(message.catch_error);
  }
};

module.exports = { verifyWebsiteUser };
