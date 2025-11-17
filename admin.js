// =========================
// PAGE SWITCH LOGIC
// =========================
const selector = document.getElementById('pageSelector');
const gallery = document.querySelector('.gallery-from');
const events = document.querySelector('.events-from');

selector.addEventListener('change', () => {
  gallery.classList.remove('active');
  events.classList.remove('active');
  if (selector.value === 'gallery') gallery.classList.add('active');
  if (selector.value === 'events') events.classList.add('active');
});


// =========================
// GALLERY FORM LOGIC
// =========================
const galleryForm = document.getElementById("galleryForm");
const galleryImage = document.getElementById("galleryImage");
const galleryDescriptionInput = document.getElementById("galleryDes");
const imageDescriptionDisplay = document.getElementById("imageDes");
const galleryPreview = document.getElementById("galleryPreview");
const galleryPreviewCard = document.getElementById("galleryPreviewCard");
const previewGalleryImg = document.getElementById("previewGalleryImg");
const submitGalleryBtn = document.getElementById("submitGalleryBtn");

let selectedGalleryFile = null;

// Preview selected image + show description
galleryImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedGalleryFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPreview.src = e.target.result;
      galleryPreview.style.display = "block";

      // DISPLAY typed description
      imageDescriptionDisplay.textContent = galleryDescriptionInput.value;
    };
    reader.readAsDataURL(file);
  } else {
    selectedGalleryFile = null;
  }
});

// Live update description
galleryDescriptionInput.addEventListener("input", () => {
  imageDescriptionDisplay.textContent = galleryDescriptionInput.value;
});

// Show preview card
galleryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selectedGalleryFile) {
    alert("Please select an image.");
    return;
  }

  previewGalleryImg.src = galleryPreview.src;

  galleryPreviewCard.classList.remove("hidden");
  setTimeout(() => galleryPreviewCard.classList.add("show"), 50);
});

// Upload gallery image with description
submitGalleryBtn.addEventListener("click", async () => {
  if (!selectedGalleryFile) {
    alert("Select an image before uploading.");
    return;
  }

  const description = galleryDescriptionInput.value.trim();

  if (!description) {
    alert("Please enter a description.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedGalleryFile);
  formData.append("description", description);

  try {
    const response = await fetch("/api/galleryupload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      alert("✅ Image uploaded successfully!");
      galleryForm.reset();
      selectedGalleryFile = null;
      galleryPreview.style.display = "none";
      imageDescriptionDisplay.textContent = "";

      galleryPreviewCard.classList.add("hidden");
      galleryPreviewCard.classList.remove("show");
    } else {
      alert("❌ Upload failed: " + data.message);
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Server error while uploading.");
  }
});


// =========================
// EVENTS FORM LOGIC
// =========================
const eventForm = document.getElementById('eventForm');
const eventDate = document.getElementById('eventDate');
const dayDisplay = document.getElementById('dayDisplay');
const eventImage = document.getElementById('eventImage');
const eventPreview = document.getElementById('eventPreview');
const previewCard = document.getElementById('eventPreviewCard');
const submitBtn = document.getElementById('submit-btn');

// Show auto day of week
eventDate.addEventListener('change', () => {
  const dateValue = new Date(eventDate.value);
  if (!isNaN(dateValue)) {
    const day = dateValue.toLocaleDateString('en-US', { weekday: 'long' });
    dayDisplay.textContent = `Day: ${day}`;
  } else {
    dayDisplay.textContent = "";
  }
});

// Preview event image
eventImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      eventPreview.src = e.target.result;
      eventPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Show event preview card
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('eventTitle').value.trim();
  const desc = document.getElementById('eventDesc').value.trim();
  const date = document.getElementById('eventDate').value;
  const file = eventImage.files[0];

  if (!title || !desc || !date || !file) {
    alert("Please fill in all fields and upload an image.");
    return;
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewDesc').textContent = desc;
  document.getElementById('previewDate').textContent = formattedDate;
  document.getElementById('previewImg').src = eventPreview.src;

  previewCard.classList.remove("hidden");
  setTimeout(() => previewCard.classList.add("show"), 50);
});

// Submit event
submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("eventTitle").value.trim();
  const description = document.getElementById("eventDesc").value.trim();
  const date = document.getElementById("eventDate").value;
  const day = document.getElementById("dayDisplay").textContent.replace("Day: ", "").trim();
  const file = eventImage.files[0];

  if (!title || !description || !date || !file) {
    alert("Please fill all fields and upload an image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      throw new Error("Image upload failed");
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        day,
        image: uploadData.filePath,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Event saved successfully!");
      previewCard.classList.add("hidden");
      eventForm.reset();
    } else {
      alert("❌ Failed to save event.");
    }

  } catch (error) {
    console.error(error);
    alert("Server error while saving event.");
  }
});


// =========================
// DASHBOARD BUTTON
// =========================
const dashboard = document.getElementById('dashboard');
dashboard.onclick = () => {
  window.location.href = "dashboard.html";
};
