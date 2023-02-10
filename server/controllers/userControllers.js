// const db = require("../connection/conn");
// const util = require("util");
// const query = util.promisify(db.query).bind(db);

// Import Sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");

// Import models
const db = require("./../models/index");
const users = db.users;

// Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

// Import jwt
const { createToken } = require("./../lib/jwt");

module.exports = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, password, role } = req.body; // {}

      await users.create({
        username,
        email,
        password: await hashPassword(password),
        role,
      });

      res.status(201).send({
        isError: false,
        message: "Register Success",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.errors[0].message,
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      let { usernameOrEmail, password } = req.query;

      let findUsernameOrEmail = await users.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      if (!findUsernameOrEmail)
        return res.status(404).send({
          isError: true,
          message: "Username or Email Not Found",
          data: true,
        });

      let hasMatchResult = await hashMatch(
        password,
        findUsernameOrEmail.dataValues.password
      );

      if (hasMatchResult === false)
        return res.status(404).send({
          isError: true,
          message: "Password Not Valid",
          data: true,
        });

      res.status(200).send({
        isError: false,
        message: "Login Success",
        data: {
          token: createToken({ id: findUsernameOrEmail.dataValues.id }),
        },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },
};
