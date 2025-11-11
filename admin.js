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
const galleryPreview = document.getElementById("galleryPreview");
const galleryPreviewCard = document.getElementById("galleryPreviewCard");
const previewGalleryImg = document.getElementById("previewGalleryImg");
const editGalleryBtn = document.getElementById("editGalleryBtn");
const submitGalleryBtn = document.getElementById("submitGalleryBtn");

let selectedGalleryFile = null;

// Preview selected image
galleryImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedGalleryFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPreview.src = e.target.result;
      galleryPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    selectedGalleryFile = null;
  }
});

// Show preview card
galleryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedGalleryFile) {
    alert("Please select an image first.");
    return;
  }

  previewGalleryImg.src = galleryPreview.src;
  galleryPreviewCard.classList.remove("hidden");
  setTimeout(() => galleryPreviewCard.classList.add("show"), 50);
});

// Edit (back) button for gallery
editGalleryBtn.addEventListener("click", () => {
  galleryPreviewCard.classList.add("hidden");
  galleryPreviewCard.classList.remove("show");
  galleryPreview.style.display = "block";
});

// Upload gallery image
submitGalleryBtn.addEventListener("click", async () => {
  if (!selectedGalleryFile) {
    alert("Please select an image before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedGalleryFile);

  try {
    const response = await fetch("/api/galleryupload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      alert("✅ Image uploaded successfully!");
      galleryForm.reset();
      galleryPreviewCard.classList.add("hidden");
      selectedGalleryFile = null;
    } else {
      alert("❌ Failed to upload image: " + data.message);
    }
  } catch (error) {
    console.error("Gallery upload error:", error);
    alert("Server error while uploading image.");
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
const eventEditBtn = previewCard.querySelector('.edit-btn');
const submitBtn = document.getElementById('submit-btn');

// Auto display day when selecting date
eventDate.addEventListener('change', () => {
  const dateValue = new Date(eventDate.value);
  if (!isNaN(dateValue)) {
    const day = dateValue.toLocaleDateString('en-US', { weekday: 'long' });
    dayDisplay.textContent = `Day: ${day}`;
  } else {
    dayDisplay.textContent = "";
  }
});

// Preview selected event image
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

// Show preview card when clicking "Preview Event"
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

  previewCard.classList.remove('hidden');
  setTimeout(() => previewCard.classList.add('show'), 50);
});

// Edit (back) button for event preview
eventEditBtn.addEventListener("click", () => {
  previewCard.classList.add("hidden");
  previewCard.classList.remove("show");
  eventPreview.style.display = "block";
});

// Submit event data to backend
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const title = document.getElementById("eventTitle").value.trim();
    const description = document.getElementById("eventDesc").value.trim();
    const date = document.getElementById("eventDate").value;
    const day = document.getElementById("dayDisplay").textContent.replace("Day: ", "").trim();
    const file = document.getElementById("eventImage").files[0];

    if (!title || !description || !date || !file) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Image upload failed");

      // Step 2: Save event
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
        console.log("Saved Event:", data.event);
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
}
