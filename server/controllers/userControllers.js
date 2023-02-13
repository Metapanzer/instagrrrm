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
const transporter = require("./../helpers/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");

module.exports = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { email, fullname, username, password } = req.body;
      await users.create(
        {
          email,
          fullname,
          username,
          password: await hashPassword(password),
        },
        { transaction: t }
      );

      let template = await fs.readFile("./template/verification.html", "utf-8");
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        fullname: fullname,
      });
      await transporter.sendMail({
        from: "Instagrrrm",
        to: email,
        subject: "Email Verification",
        html: newTemplate,
      });
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Register Success",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error?.errors[0]?.message,
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      let { emailOrUsername, password } = req.query;

      let findEmailOrUsername = await users.findOne({
        where: {
          [Op.or]: [{ username: emailOrUsername }, { email: emailOrUsername }],
        },
      });

      if (!findEmailOrUsername)
        return res.status(404).send({
          isError: true,
          message: "Username or Email Not Found",
          data: true,
        });

      let hasMatchResult = await hashMatch(
        password,
        findEmailOrUsername.dataValues.password
      );

      if (hasMatchResult === false)
        return res.status(404).send({
          isError: true,
          message: "Incorrect password",
          data: true,
        });
      res.status(200).send({
        isError: false,
        message: "Login Success",
        data: {
          token: createToken({ id: findEmailOrUsername.dataValues.id }),
          user: {
            id: findEmailOrUsername.dataValues.id,
            username: findEmailOrUsername.dataValues.username,
            email: findEmailOrUsername.dataValues.email,
            fullname: findEmailOrUsername.dataValues.fullname,
            profile_picture: findEmailOrUsername.dataValues.profile_picture,
            bio: findEmailOrUsername.dataValues.bio,
            is_verified: findEmailOrUsername.dataValues.is_verified,
          },
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
  getProfile: async (req, res) => {
    try {
      let users_id = req.params.id;

      let response = await users.findOne({
        where: {
          id: users_id,
        },
      });
      res.status(201).send({
        isError: false,
        message: "Get Profile Success",
        data: response,
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
