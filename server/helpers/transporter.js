const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL, // Email Sender
    pass: process.env.GMAIL_KEY, // Key Generate
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
