const fs = require("fs");

const deleteFiles = (files) => {
  files.forEach((value) => {
    fs.unlink(value.path, function (err) {
      try {
        if (err) throw err;
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = deleteFiles;
