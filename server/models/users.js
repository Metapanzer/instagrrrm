const { UUIDV4 } = require("sequelize");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.contents, { foreignKey: "users_id" });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Username already in Use",
        },
      },
      password: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Invalid email" },
        },
        unique: true,
      },
      profile_picture: DataTypes.STRING,
      fullname: DataTypes.STRING,
      bio: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
