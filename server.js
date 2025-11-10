const express = require("express");
const path = require("path");
const cors = require("cors");
const mySql = require("mysql2");
const { Sequelize } = require("sequelize");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve static files from current directory
app.use(express.static(__dirname));



const sequelize = new Sequelize("ebenezer_school", "root", "Mysql123", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // disable SQL logs
});

// Verify connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL via Sequelize.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;



// --- API ROUTES ---
app.post("/api/login", (req, res) => {
  console.log("Login attempt:", req.body.email);
  const { email, password } = req.body;

  if (email === "admin@school.com" && password === "123456") {
    res.json({
      success: true,
      message: "Login successful!",
      token: "fake-jwt-token",
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// --- PAGE ROUTES ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "auth.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.post("/api/events", async (req, res) => {
  console.log("✅ /api/events called", req.body);
  res.json({ success: true });
});


// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${__dirname}`);
  console.log(`🔑 Test Login: admin@school.com / 123456`);
});
