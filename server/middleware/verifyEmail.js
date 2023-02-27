const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyEmail = (req, res, next) => {
  // Get token from headers
  const token = req.params.token;

  if (!token)
    return res
      .status(401)
      .send({ error: true, message: "Link invalid!", data: null });

  jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    try {
      if (err) {
        return res.status(401).send({
          error: true,
          message: "Verification link expired!",
          data: null,
        });
      }

      req.tokenDecode = data;

      next();
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = verifyEmail;
