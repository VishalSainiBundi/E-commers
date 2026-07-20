const message = require("../message");
const { verifyToken } = require("../helper/helper");

const verifySuperAdmin = (req, res, next) => {
  try {
    const token = req.cookies["admin_token"];
    if (!token) {
      return res.status(401).send({ msg: "Unauthorized access", flag: 0 });
    } else {
      const admin_data = verifyToken(token);
      if (admin_data != null) {
        if (admin_data.admin_type == 0) {
          return next();
        } else {
          return res.status(401).send({ msg: "Unauthorized access", flag: 0 });
        }
      } else {
        return res.status(401).send({ msg: "Unauthorized access", flag: 0 });
      }
    }
    // Verify token logic here
  } catch (error) {
    return res.send(message.catch_error);
  }
};
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies["admin_token"];
    if (!token) {
      return res.send({ msg: "Unauthorized access", flag: 0 });
    } else {
      if (verifyToken(token) != null) {
        return next();
      } else {
        return res.send({ msg: "Unauthorized access", flag: 0 });
      }
    }
    // Verify token logic here
  } catch (error) {
    return res.send(message.catch_error);
  }
};

module.exports = { verifySuperAdmin, verifyAdmin };
