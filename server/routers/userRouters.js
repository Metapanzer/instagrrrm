const express = require("express");
const Router = express.Router();
const uploadImages = require("../middleware/uploadImages");
const verifyToken = require("../middleware/verifyToken");
const verifyEmail = require("../middleware/verifyEmail");

// Import Controller
const { userControllers } = require("../controllers");

Router.post("/register", userControllers.register);
Router.get("/login", userControllers.login);
Router.get("/profile/:username", userControllers.getProfile);
Router.patch(
  "/edit/picture",
  verifyToken,
  uploadImages,
  userControllers.changePicture
);
Router.patch("/edit/profile", verifyToken, userControllers.changeProfile);
Router.patch("/edit/password", verifyToken, userControllers.changePassword);
Router.patch("/verify/:token", verifyEmail, userControllers.verifyEmail);

module.exports = Router;
