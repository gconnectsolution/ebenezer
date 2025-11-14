const contentBox = document.getElementById("dashboardContent");
const selector = document.getElementById("dashboardSelect");

// Load initial content
loadGallery();

// Listener for dropdown switching
selector.addEventListener("change", () => {
  if (selector.value === "gallery") {
    loadGallery();
  } else {
    loadEvents();
  }
});


// -----------------------------
// LOAD GALLERY
// -----------------------------
async function loadGallery() {
  contentBox.innerHTML = "<p>Loading gallery...</p>";

  try {
    const res = await fetch("/api/gallery");
    const data = await res.json();

    contentBox.innerHTML = "";

    data.images.forEach(img => {
      // Only show gallery images uploaded via dashboard
      if (!img.includes("/galleryimages/")) {
        return; // Skip static images
      }

      const filename = img.replace("/galleryimages/", "");

      const box = document.createElement("div");
      box.className = "gallery-item-box";

      box.innerHTML = `
        <img src="${img}" alt="">
        <div class="item-details">
          <h3>${filename}</h3>
        </div>
        <button class="delete-btn" onclick="deleteGalleryImage('${filename}')">Delete</button>
      `;

      contentBox.appendChild(box);
    });
    
  } catch (error) {
    contentBox.innerHTML = "<p>Error loading gallery.</p>";
    console.error("Gallery Load Error:", error);
  }
}


// -----------------------------
// DELETE GALLERY IMAGE
// -----------------------------
async function deleteGalleryImage(filename) {
  if (!confirm("Delete this image?")) return;

  try {
    const res = await fetch(`/api/gallery/${filename}`, { method: "DELETE" });
    const data = await res.json();

    alert(data.message);
    loadGallery();

  } catch (error) {
    alert("Server error. Could not delete.");
    console.error("Delete error:", error);
  }
}


// -----------------------------
// LOAD EVENTS
// -----------------------------
async function loadEvents() {
  contentBox.innerHTML = "<p>Loading events...</p>";

  try {
    const res = await fetch("/api/events");
    const data = await res.json();

    contentBox.innerHTML = "";

    data.events.forEach(event => {
      const box = document.createElement("div");
      box.className = "event-item-box";

      box.innerHTML = `
        <img src="${event.image}" alt="">
        <div class="item-details">
          <h3>${event.title}</h3>
          <p>${event.date}</p>
        </div>
        <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      `;

      contentBox.appendChild(box);
    });

  } catch (error) {
    contentBox.innerHTML = "<p>Error loading events.</p>";
    console.error("Events Load Error:", error);
  }
}


// -----------------------------
// DELETE EVENT
// -----------------------------
async function deleteEvent(id) {
  try {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    const data = await res.json();

    alert(data.message);
    loadEvents(); // reload list
  } catch (err) {
    console.error("Delete event error:", err);
    alert("Server error while deleting event.");
  }
}

const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Unauthorized access! Please log in first.");
    window.location.href = "/auth.html";
  }