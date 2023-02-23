// Import Sequelize
const { sequelize } = require("./../models");
const { Op, where } = require("sequelize");

// Import models
const db = require("./../models/index");
const users = db.users;
const contents = db.contents;

// Import hash function
const { hashPassword, hashMatch } = require("./../lib/hash");
// Import deleteFiles helpers
const deleteFiles = require("./../helpers/deleteFiles");

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
      //TODO: add token for email verification
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
      const username = req.params.username;

      const response = await users.findOne({
        where: {
          username,
        },
      });

      const users_id = response.id;

      const { count } = await contents.findAndCountAll({
        where: {
          users_id,
        },
      });

      res.status(201).send({
        isError: false,
        message: "Get Profile Success",
        data: {
          user: {
            id: response.id,
            username: response.username,
            email: response.email,
            fullname: response.fullname,
            profile_picture: response.profile_picture,
            bio: response.bio,
            is_verified: response.is_verified,
            posts: count,
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
  changePicture: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.dataDecode?.id;
      let profile_picture = req.files?.images[0]?.path.replace("public\\", "");

      await users.update(
        {
          profile_picture,
        },
        { where: { id } },
        { transaction: t }
      );

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Upload Success!",
        data: null,
      });
    } catch (error) {
      console.log(error);
      deleteFiles(req.files.images);
      t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
