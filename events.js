const { DataTypes } = require("sequelize");
const sequelize = require("./server"); // Adjust path if your server.js is one level above

const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  day: { type: DataTypes.STRING },
});

module.exports = Event;
