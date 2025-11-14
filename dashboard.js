// ==========================
// DASHBOARD SELECTOR + INIT
// ==========================

const contentBox = document.getElementById("dashboardContent");
const selector = document.getElementById("dashboardSelect");

// Popup elements
const popupOverlay = document.getElementById("popupOverlay");
const popupCard = document.getElementById("popupCard");
const popupTitle = document.getElementById("popupTitle");
const popupImage = document.getElementById("popupImage");

const popupEventTitle = document.getElementById("popupEventTitle");
const popupEventDesc = document.getElementById("popupEventDesc");
const popupEventDate = document.getElementById("popupEventDate");
const popupEventImage = document.getElementById("popupEventImage");

const popupGalleryReplace = document.getElementById("popupGalleryReplace");

const popupSave = document.getElementById("popupSave");
const popupClose = document.getElementById("popupClose");

let editingType = null;  // "event" or "gallery"
let editingId = null;    // event ID or filename
let currentEventImage = null;

// Load initial content
loadGallery();

// Switch between gallery & events
selector.addEventListener("change", () => {
  if (selector.value === "gallery") loadGallery();
  else loadEvents();
});


// ==========================
// LOAD GALLERY IMAGES
// ==========================
async function loadGallery() {
  contentBox.innerHTML = "<p>Loading gallery...</p>";

  try {
    const res = await fetch("/api/gallery");
    const data = await res.json();

    contentBox.innerHTML = "";

    data.images.forEach(img => {
      if (!img.includes("/galleryimages/")) return;

      const filename = img.replace("/galleryimages/", "");

      const box = document.createElement("div");
      box.className = "gallery-item-box";

      box.innerHTML = `
        <img src="${img}" alt="">
        <div class="item-details">
            <h3>${filename}</h3>
        </div>
        <button class="edit-btn" onclick="openEditPopup('gallery', '${filename}', '${img}')">Edit</button>
        <button class="delete-btn" onclick="deleteGalleryImage('${filename}')">Delete</button>
      `;

      contentBox.appendChild(box);
    });

  } catch (error) {
    contentBox.innerHTML = "<p>Error loading gallery.</p>";
    console.error("Gallery Load Error:", error);
  }
}


// ==========================
// DELETE GALLERY IMAGE
// ==========================
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


// ==========================
// LOAD EVENTS
// ==========================
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
        <button class="edit-btn" 
            onclick="openEditPopup('event', '${event.id}', '${event.image}', '${event.title}', '${event.description}', '${event.date}')">
            Edit
        </button>
        <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      `;

      contentBox.appendChild(box);
    });

  } catch (error) {
    contentBox.innerHTML = "<p>Error loading events.</p>";
    console.error("Events Load Error:", error);
  }
}


// ==========================
// DELETE EVENT
// ==========================
async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;

  try {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    const data = await res.json();

    alert(data.message);
    loadEvents();

  } catch (err) {
    console.error("Delete event error:", err);
    alert("Server error while deleting event.");
  }
}



// ======================================================
//                EDIT POPUP FUNCTION
// ======================================================
function openEditPopup(type, id, img, title = "", desc = "", date = "") {

  editingType = type;
  editingId = id;
  currentEventImage = img;

  popupImage.src = img;

  // Hide all fields first
  document.querySelectorAll(".event-field, .gallery-field")
    .forEach(el => el.style.display = "none");

  if (type === "event") {
    popupTitle.innerText = "Edit Event";

    document.querySelectorAll(".event-field").forEach(el => el.style.display = "block");

    popupEventTitle.value = title;
    popupEventDesc.value = desc;
    popupEventDate.value = date ? date.split("T")[0] : "";
  }

  if (type === "gallery") {
    popupTitle.innerText = "Edit Gallery Image";

    document.querySelectorAll(".gallery-field").forEach(el => el.style.display = "block");
  }

  popupOverlay.style.display = "flex";
}



// ======================================================
//                SAVE POPUP CHANGES
// ======================================================
popupSave.addEventListener("click", async () => {

  // ---------------------- EVENT UPDATE ----------------------
  if (editingType === "event") {
    let newImagePath = currentEventImage;

    const newImgFile = popupEventImage.files[0];

    if (newImgFile) {
      const fd = new FormData();
      fd.append("image", newImgFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });

      const result = await uploadRes.json();
      if (result.success) newImagePath = result.filePath;
    }

    const updatedEvent = {
      title: popupEventTitle.value,
      description: popupEventDesc.value,
      date: popupEventDate.value,
      image: newImagePath,
    };

    const res = await fetch(`/api/events/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent)
    });

    const data = await res.json();
    alert(data.message);

    loadEvents();
  }



  // ---------------------- GALLERY UPDATE ----------------------
  if (editingType === "gallery") {
    const file = popupGalleryReplace.files[0];

    if (!file) {
      alert("Please select an image to replace.");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    const uploadRes = await fetch("/api/galleryupload", {
      method: "POST",
      body: fd
    });
    const result = await uploadRes.json();

    if (result.success) {
      await fetch(`/api/gallery/${editingId}`, { method: "DELETE" });
      loadGallery();
    }
  }

  popupOverlay.style.display = "none";
});

popupClose.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});



// ==========================
// AUTH CHECK
// ==========================
const token = localStorage.getItem("authToken");
if (!token) {
  alert("Unauthorized access! Please log in first.");
  window.location.href = "/auth.html";
}
