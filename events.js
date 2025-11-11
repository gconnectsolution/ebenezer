
const { Sequelize, DataTypes } = require("sequelize");

// Create Sequelize instance (reuse same credentials)
const sequelize = new Sequelize("ebenezer_school", "root", "Mysql123", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});

const Event = sequelize.define("Event", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  day: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
});

module.exports = Event;
