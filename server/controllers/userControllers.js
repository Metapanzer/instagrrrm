const db = require("../connection/conn");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = {
  //dummy
  login: async (req, res) => {
    try {
      //Get data from client (req.body)
      let { username, password } = req.body;

      //Check username, password, and role if exist in the database
      let getUsernameAndRole = await query(
        `SELECT * FROM users WHERE username='${username}' AND password='${password}'`
      );

      //If data doesn't exist, send error response
      if (getUsernameAndRole.length !== 1)
        return res.status(404).send({
          isError: true,
          message: "Username and Password Invalid",
          data: null,
        });

      //If data exist, send success response
      res.status(200).send({
        isError: false,
        message: "Login Success!",
        data: getUsernameAndRole,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
