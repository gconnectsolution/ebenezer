// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const Event = require("./events"); // your Sequelize model file (events.js)

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// --- Database Setup ---
const sequelize = new Sequelize("ebenezer_school", "root", "Mysql123", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL via Sequelize.");

    // Sync models (create table if missing)
    await Event.sync();
    console.log("✅ Events table ready.");
  } catch (error) {
    console.error("❌ DB connection error:", error);
  }
})();

// --- API ROUTES ---

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@school.com" && password === "123456") {
    res.json({ success: true, message: "Login successful!", token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Create new event
app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, day } = req.body;
    const event = await Event.create({ title, description, date, day });
    res.json({ success: true, message: "Event saved successfully!", event });
  } catch (error) {
    console.error("❌ Error saving event:", error);
    res.status(500).json({ success: false, message: "Failed to save event." });
  }
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["date", "ASC"]] });
    res.json({ success: true, events });
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events." });
  }
});

// Page routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "auth.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin.html")));

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
