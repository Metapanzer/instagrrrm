const express = require("express");
const Router = express.Router();

// Import Controller
const { userControllers } = require("../controllers");

Router.post("/register", userControllers.register);
Router.get("/login", userControllers.login);

module.exports = Router;
