"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.comments, { foreignKey: "contents_id" });
      this.belongsTo(models.users, { foreignKey: "users_id" });
    }
  }
  contents.init(
    {
      media: DataTypes.STRING,
      caption: DataTypes.STRING,
      like: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "contents",
    }
  );
  return contents;
};
