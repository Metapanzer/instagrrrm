const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtVerify = (req, res, next) => {
  // Get token from headers
  const token = req.headers.auth;

  if (!token)
    return res
      .status(406)
      .send({ error: true, message: "Token Not Found!", data: null });

  jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    try {
      if (err) throw err;

      req.dataDecode = data;

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

module.exports = jwtVerify;
