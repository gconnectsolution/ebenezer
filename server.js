const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const { Sequelize } = require("sequelize");
const Event = require("./events");

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));
app.use("/eventimages", express.static(path.join(__dirname, "eventimages")));
app.use("/galleryimages", express.static(path.join(__dirname, "galleryimages")));

// --- DATABASE SETUP ---
const sequelize = new Sequelize("ebenezer_school", "root", "Mysql123", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    await Event.sync({ alter: true });
    console.log("✅ Connected to MySQL & Events table ready.");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

// --- MULTER (File Upload Setup) ---
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "eventimages/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadEventImage = multer({ storage: eventStorage });

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "galleryimages/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadGalleryImage = multer({ storage: galleryStorage });

// --- LOGIN ROUTE ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "ebenezer" && password === "admin@ebenezer") {
    return res.json({
      success: true,
      message: "Login successful!",
      token: "fake-jwt-token",
    });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// --- EVENT IMAGE UPLOAD ROUTE ---
app.post("/api/upload", uploadEventImage.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  const filePath = `/eventimages/${req.file.filename}`;
  res.json({ success: true, filePath });
});

// --- GALLERY IMAGE UPLOAD ROUTE ---
app.post("/api/galleryupload", uploadGalleryImage.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  const filePath = `/galleryimages/${req.file.filename}`;
  res.json({ success: true, filePath });
});

// --- CREATE EVENT ROUTE ---
app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, day, image } = req.body;
    if (!title || !description || !date)
      return res.status(400).json({ success: false, message: "Missing fields." });

    const event = await Event.create({ title, description, date, day, image });
    res.json({ success: true, message: "Event saved successfully!", event });
  } catch (error) {
    console.error("❌ Error saving event:", error);
    res.status(500).json({ success: false, message: "Failed to save event." });
  }
});

// --- GET ALL EVENTS ---
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["date", "ASC"]] });
    res.json({ success: true, events });
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events." });
  }
});

// --- GET ALL GALLERY IMAGES ---
app.get("/api/gallery", (req, res) => {
  const folderPath = path.join(__dirname, "galleryimages");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("❌ Error reading gallery folder:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to read gallery folder." });
    }

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map((file) => `/galleryimages/${file}`);

    res.json({ success: true, images });
  });
});

// --- SERVE PAGES ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin.html")));
app.get("/events", (req, res) => res.sendFile(path.join(__dirname, "events.html")));
app.get("/gallery", (req, res) => res.sendFile(path.join(__dirname, "gallery.html")));

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
