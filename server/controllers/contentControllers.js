// Import Sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");

// Import models
const db = require("./../models/index");
const users = db.users;
const contents = db.contents;
const comments = db.comments;

// Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

// Import jwt
const { createToken } = require("./../lib/jwt");
const transporter = require("./../helpers/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");

module.exports = {
  createPost: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let users_id = req.dataDecode?.id;
      let caption = req.body.caption;
      let media = req.files.images[0].path;

      await contents.create(
        {
          media,
          caption,
          users_id,
        },
        { transaction: t }
      );

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Upload Success!",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  allContent: async (req, res) => {
    try {
      let allContents = await sequelize.query(
        "SELECT contents.id, contents.media, contents.caption, contents.like, contents.createdAt, users.username FROM contents JOIN users ON contents.users_id = users.id;"
      );

      res.status(200).send({
        isError: false,
        message: "Get All Contents",
        data: allContents[0],
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },
  contentDetails: async (req, res) => {
    try {
      let id = req.params.id;
      let detail = await sequelize.query(
        `SELECT contents.*, users.username FROM contents JOIN users ON contents.users_id = users.id WHERE contents.id = ${id};`
      );

      let comment = await comments.findAll({
        where: {
          contents_id: id,
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get Content Details",
        data: detail[0],
        comment,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },
  createComment: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let users_id = req.dataDecode?.id;
      let contents_id = req.params;
      let comment_body = req.body;

      await comments.create(
        {
          comment_body,
          contents_id,
          users_id,
        },
        { transaction: t }
      );

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Upload Success!",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
