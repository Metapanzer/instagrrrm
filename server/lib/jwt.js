const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  },

  validateToken: (token) => {
    return jwt.verify(token, process.env.JWT_KEY);
  },
};
