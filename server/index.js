//Import ExpressJS dependencies
const express = require("express");
const app = express();

//Parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

//Define PORT and response for default route
const PORT = 5000;
app.get("/", (req, res) => {
  res.status(201).send("<h1>Welcome to instagram<h1>");
});

//CORS (granting access from different network (front end to back end))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ### Sequelize Synchronous
// const Sequelize = require('sequelize');
// const Models = require('./models');
// Models.sequelize.sync({
//     force : false,
//     alter: true,
//     logging : console.log
// }).then(function () {
//     console.log('Database is Synchronized!')

// }).catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!")
// });

//Import router for controller from index.js inside routers folder
const { userRouters } = require("./routers"); //refer to index.js in routers folder
app.use("/", userRouters);

//Run the API
app.listen(PORT, () => console.log("API running on Port: " + PORT));
