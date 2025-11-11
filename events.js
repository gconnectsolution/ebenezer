// events.js
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
gsap.registerPlugin(ScrollTrigger);

// reveal sections with stagger (sections are .reveal)
gsap.utils.toArray(".reveal").forEach((el, i) => {
  gsap.fromTo(
    el,
    { y: 60, opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      delay: i * 0.05
    }
  );
});