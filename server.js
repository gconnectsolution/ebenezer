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
const sequelize = new Sequelize("u542801010_school", "u542801010_ebenezer", "Gconnectsolutions@2025", {
  host: "srv1823.hstgr.io",
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

const galleryDataFile = path.join(__dirname, "galleryData.json");

// Load existing gallery descriptions
function loadGalleryData() {
  if (!fs.existsSync(galleryDataFile)) return [];
  return JSON.parse(fs.readFileSync(galleryDataFile, "utf-8"));
}

// Save updated gallery descriptions
function saveGalleryData(data) {
  fs.writeFileSync(galleryDataFile, JSON.stringify(data, null, 2));
}


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
  const description = req.body.description;

  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  const filePath = `/galleryimages/${req.file.filename}`;

  // Load existing data
  const galleryData = loadGalleryData();

  // Add new image entry
  galleryData.push({
    src: filePath,
    description: description || "No description",
    alt: "Gallery Image",
    size: ""
  });

  // Save metadata file
  saveGalleryData(galleryData);

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

  // Load metadata JSON
  const galleryData = loadGalleryData();

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("❌ Error reading gallery folder:", err);
      return res.status(500).json({ success: false, message: "Failed to read gallery folder." });
    }

    // Convert folder images → metadata format (in case not in JSON)
    const folderImages = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => {
        const pathSrc = `/galleryimages/${file}`;

        // If JSON already has this image, skip adding duplicate
        const exists = galleryData.find(img => img.src === pathSrc);
        if (exists) return null;

        return {
          src: pathSrc,
          alt: "Gallery Image",
          description: "No description",
          size: ""
        };
      })
      .filter(Boolean); // remove nulls

    // Combine JSON + folder images
    const finalImages = [...galleryData, ...folderImages];

    res.json({ success: true, images: finalImages });
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

// --- DELETE GALLERY IMAGE ---
app.delete("/api/gallery/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "galleryimages", filename);

  // 1. Load galleryData.json
  let galleryData = loadGalleryData();

  // 2. Remove the item from JSON metadata
  const filtered = galleryData.filter(item => item.src !== `/galleryimages/${filename}`);

  if (filtered.length === galleryData.length) {
    console.log("⚠ JSON entry not found, but continuing…");
  }

  // save updated JSON
  saveGalleryData(filtered);

  // 3. Delete actual file from folder
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("❌ Error deleting file:", err);
        return res.status(500).json({ success: false, message: "File exists but deletion failed" });
      }

      return res.json({ success: true, message: "Image deleted successfully!" });
    });
  } else {
    return res.json({
      success: true,
      message: "Image deleted (file did not exist, metadata removed)."
    });
  }
});



// --- UPDATE EVENT (supports image upload too) ---
app.put("/api/events/:id", uploadEventImage.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // If new image was uploaded → use it
    let updatedImage = event.image;
    if (req.file) {
      updatedImage = `/eventimages/${req.file.filename}`;

      // delete old image
      if (event.image) {
        const oldImg = event.image.replace("/eventimages/", "");
        const oldPath = path.join(__dirname, "eventimages", oldImg);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await event.update({
      title,
      description,
      date,
      image: updatedImage
    });

    res.json({
      success: true,
      message: "Event updated successfully!",
      event
    });

  } catch (error) {
    console.error("❌ Update event error:", error);
    res.status(500).json({ success: false, message: "Failed to update event." });
  }
});




// --- DELETE EVENT ---
app.delete("/api/events/:id", async (req, res) => {
  
  try {
    const eventId = req.params.id;

    // Find the event first
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // If event has an image, delete it
    if (event.image) {
      const imageName = event.image.replace("/eventimages/", "");
      const imagePath = path.join(__dirname, "eventimages", imageName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete event from DB
    await event.destroy();

    res.json({ success: true, message: "Event deleted successfully!" });

  } catch (error) {
    console.error("❌ Delete event error:", error);
    res.status(500).json({ success: false, message: "Failed to delete event." });
  }
});

// --- UPDATE GALLERY DESCRIPTION ONLY ---
app.post("/api/gallery/update-description", (req, res) => {
  const { filename, description } = req.body;

  if (!filename) {
    return res.status(400).json({ success: false, message: "Filename missing." });
  }

  // Load existing metadata
  let galleryData = loadGalleryData();

  // Find entry
  const item = galleryData.find(img => img.src === `/galleryimages/${filename}`);

  if (!item) {
    return res.status(404).json({ success: false, message: "Image not found in metadata." });
  }

  // Update description (keeping old one if missing)
  item.description = description && description.trim() !== "" ? description : item.description;

  // Save updated JSON
  saveGalleryData(galleryData);

  res.json({ success: true, message: "Description updated successfully!" });
});




// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
