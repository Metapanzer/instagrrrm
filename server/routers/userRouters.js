const express = require("express");
const Router = express.Router();
const uploadImages = require("../middleware/uploadImages");
const verifyToken = require("../middleware/verifyToken");

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
Router.post("/verify/:token", verifyToken, userControllers.verifyEmail);

module.exports = Router;
