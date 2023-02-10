//import .env
require("dotenv").config();
//Import mysql dependencies
const mysql = require("mysql2");

//Database connection setting
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

db.connect((err) => {
  if (err) return console.log("Error" + err.message);

  console.log("Connected to Database");
});

module.exports = db;
