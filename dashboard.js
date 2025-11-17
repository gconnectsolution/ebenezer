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
const popupGalleryDescription = document.getElementById("popupGalleryDescription");


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

    data.images.forEach(item => {
      const filename = item.src.replace("/galleryimages/", "");

      const box = document.createElement("div");
      box.className = "gallery-item-box";

      box.innerHTML = `
  <img src="${item.src}" alt="">
  <div class="item-details">
      <h3>${filename}</h3>
      <p class="item-desc">${item.description || "No description"}</p>
  </div>
  <button class="edit-btn">Edit</button>
  <button class="delete-btn">Delete</button>
`;

// attach listeners (keeps description available)
const editBtn = box.querySelector('.edit-btn');
editBtn.addEventListener('click', () => {
  openEditPopup('gallery', filename, item.src, /* title */ '', /* desc */ item.description || '', /* date */ '');
});

const deleteBtn = box.querySelector('.delete-btn');
deleteBtn.addEventListener('click', () => deleteGalleryImage(filename));


      contentBox.appendChild(box);
    });

  } catch (err) {
    console.error(err);
    contentBox.innerHTML = "<p>Error loading gallery.</p>";
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
  } catch (e) {
    alert("Server error");
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
function openEditPopup(type, id, img, title = "", desc = "", date = "") {
  editingType = type;
  editingId = id;
  currentEventImage = img;

  if (popupImage) popupImage.src = img;

  // Hide all fields first
  document.querySelectorAll(".event-field, .gallery-field").forEach(el => el.style.display = "none");

  if (type === "event") {
    popupTitle.innerText = "Edit Event";
    document.querySelectorAll(".event-field").forEach(el => el.style.display = "block");
    if (popupEventTitle) popupEventTitle.value = title;
    if (popupEventDesc) popupEventDesc.value = desc || "";
    if (popupEventDate) popupEventDate.value = date ? date.split("T")[0] : "";
  }

  if (type === "gallery") {
  popupTitle.innerText = "Edit Gallery Image";
  document.querySelectorAll(".gallery-field").forEach(el => el.style.display = "block");

  if (popupGalleryDescription) {
    popupGalleryDescription.value = desc || "";
    popupGalleryDescription.dataset.oldValue = desc || "";
  } else {
    console.warn("popupGalleryDescription element not found in DOM.");
  }

  if (popupGalleryReplace) popupGalleryReplace.value = "";
}

  if (popupOverlay) popupOverlay.style.display = "flex";
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
  // Defensive checks
  if (!popupGalleryDescription) {
    console.error("popupGalleryDescription is missing. Aborting gallery update.");
    alert("Internal error: description field missing.");
    popupOverlay.style.display = "none";
    return;
  }

  // Read values
  let newDescription = popupGalleryDescription.value ? popupGalleryDescription.value.trim() : "";
  const oldDescription = popupGalleryDescription.dataset?.oldValue ?? "";

  // If user left description empty, keep old value
  if (!newDescription) {
    newDescription = oldDescription;
  }

  const file = (popupGalleryReplace && popupGalleryReplace.files && popupGalleryReplace.files[0]) ? popupGalleryReplace.files[0] : null;

  try {
    // CASE 1: Only description changed (no file)
    if (!file) {
      console.log("Updating gallery description for:", editingId, "desc:", newDescription);
      const res = await fetch("/api/gallery/update-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: editingId, description: newDescription })
      });

      if (!res.ok) {
        console.warn("update-description returned non-ok status", res.status);
      }
      await loadGallery();
      popupOverlay.style.display = "none";
      return;
    }

    // CASE 2: Replace image + update description
    const fd = new FormData();
    fd.append("image", file);
    fd.append("description", newDescription);
    console.log("Uploading new gallery image for:", editingId);

    const uploadRes = await fetch("/api/galleryupload", { method: "POST", body: fd });
    const uploadData = await uploadRes.json();

    if (uploadData.success) {
      // remove the old file on server if required
      await fetch(`/api/gallery/${editingId}`, { method: "DELETE" });
    } else {
      console.warn("galleryupload failed:", uploadData);
    }

    await loadGallery();
  } catch (err) {
    console.error("Gallery update error:", err);
    alert("Server error while updating gallery.");
  } finally {
    popupOverlay.style.display = "none";
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


const back = document.getElementById('back')
back.onclick = () => {
  window.location.href = '/admin.html';
}