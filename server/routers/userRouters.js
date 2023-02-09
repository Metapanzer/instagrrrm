const express = require("express");
const Router = express.Router();

// Import Controller
const { userControllers } = require("../controllers");

Router.get("/login", userControllers.login);

module.exports = Router;
