

// GSAP ScrollTrigger for panels (if not already)

const { Sequelize, DataTypes } = require("sequelize");

// Create Sequelize instance (reuse same credentials)
const sequelize = new Sequelize("u542801010_school", "u542801010_ebenezer", "Gconnectsolutions@2025", {
  host: "srv1823.hstgr.io",
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


