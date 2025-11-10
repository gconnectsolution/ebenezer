// Page Switch Logic
const selector = document.getElementById('pageSelector');
const gallery = document.querySelector('.gallery-from');
const events = document.querySelector('.events-from');

selector.addEventListener('change', () => {
  gallery.classList.remove('active');
  events.classList.remove('active');
  if (selector.value === 'gallery') gallery.classList.add('active');
  if (selector.value === 'events') events.classList.add('active');
});

// Gallery Upload Logic
const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');
const uploadForm = document.getElementById('galleryUploadForm');
const uploadStatus = document.getElementById('uploadStatus');

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const file = imageUpload.files[0];
  if (!file) {
    uploadStatus.textContent = "Please select an image before saving.";
    uploadStatus.style.color = "red";
    return;
  }
  uploadStatus.textContent = "Saving image...";
  uploadStatus.style.color = "#0b3d91";
  setTimeout(() => {
    uploadStatus.textContent = "Image saved successfully!";
    uploadStatus.style.color = "green";
    uploadForm.reset();
    previewImage.style.display = 'none';
  }, 1500);
});

// Event Form Logic
const eventForm = document.getElementById('eventForm');
const eventDate = document.getElementById('eventDate');
const dayDisplay = document.getElementById('dayDisplay');
const eventImage = document.getElementById('eventImage');
const eventPreview = document.getElementById('eventPreview');
const previewCard = document.getElementById('eventPreviewCard');

eventDate.addEventListener('change', () => {
  const dateValue = new Date(eventDate.value);
  if (!isNaN(dateValue)) {
    const day = dateValue.toLocaleDateString('en-US', { weekday: 'long' });
    dayDisplay.textContent = `Day: ${day}`;
  } else dayDisplay.textContent = "";
});

//eventImage.addEventListener('change', (e) => {
//  const file = e.target.files[0];
//  if (file && file.type.startsWith('image/')) {
//    const reader = new FileReader();
//    reader.onload = (e) => {
//      eventPreview.src = e.target.result;
//      eventPreview.style.display = 'block';
//    };
//    reader.readAsDataURL(file);
//  }
//});

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('eventTitle').value.trim();
  const desc = document.getElementById('eventDesc').value.trim();
  const date = document.getElementById('eventDate').value;
  //const file = eventImage.files[0];
  if (!title || !desc || !date) {
    alert("Please fill in all fields and upload an image.");
    return;
  }
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewDesc').textContent = desc;
  document.getElementById('previewDate').textContent = formattedDate;
  //document.getElementById('previewImg').src = eventPreview.src;
  previewCard.classList.remove('hidden');
  setTimeout(() => previewCard.classList.add('show'), 50);
});


const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', async () => {
  const title = document.getElementById('eventTitle').value.trim();
  const description = document.getElementById('eventDesc').value.trim();
  const date = document.getElementById('eventDate').value;
  const day = document.getElementById('dayDisplay').textContent.replace('Day: ', '').trim();

  if (!title || !description || !date) {
    alert("Please fill all fields before submitting.");
    return;
  }

  const payload = { title, description, date, day };

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Event saved successfully!");
      console.log("Saved Event:", data.event);
      //window.location.href = "/events.html"; // Redirect to events page
    } else {
      alert("❌ Failed to save event.");
    }
  } catch (error) {
    console.error(error);
    alert("Server error.");
  }
});
