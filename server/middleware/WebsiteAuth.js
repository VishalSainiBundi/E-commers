const message = require("../message");
const { verifytoken } = require("../helper/helper");

const verifyWebsiteUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.lo
   
    if (!token) {
      return res.status(401).send({ msg: "Unauthorized access", flag: 1 });
    } else {
      if (verifytoken(token) != null) {
        console.log("hello")

        return next();
      } else {
        console.log("hello-else")

        return res.status(401).send({ msg: "Unauthorized access", flag: 1});
      }
    }

    // Verify token logic here
  } catch (error) {
    return res.send(message.catch_error);
  }
};

module.exports = { verifyWebsiteUser };
