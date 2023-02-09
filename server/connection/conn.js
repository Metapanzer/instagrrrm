//Import mysql dependencies
const mysql = require("mysql2");

//Database connection setting
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "instagram_clone",
});

db.connect((err) => {
  if (err) return console.log("Error" + err.message);

  console.log("Connected to Database");
});

module.exports = db;
