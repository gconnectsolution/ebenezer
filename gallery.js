// ====== STATIC IMAGES (already in your project) ======
const staticImages = [
  { src: "public_html/img/event-.3.jpeg", alt: "Annual Day Celebration", size: "tall" },
  { src: "public_html/img/T1.jpg", alt: "Science Exhibition", size: "wide" },
  { src: "public_html/img/tk.jpeg", alt: "Sports Event", size: "" },
  { src: "public_html/img/tk1.jpeg", alt: "Art and Culture", size: "tall" },
  { src: "public_html/img/tk2.jpeg", alt: "Classroom Activities", size: "wide" },
  { src: "public_html/img/tk3.jpeg", alt: "Outdoor Adventures", size: "" },
  { src: "public_html/img/tk4.jpeg", alt: "Workshops", size: "wide" },
  { src: "public_html/img/tk5.jpeg", alt: "Annual Fest", size: "" },
  { src: "public_html/img/tk6.jpeg", alt: "Science Exhibition", size: "wide" },
  { src: "public_html/img/tk7.jpeg", alt: "Sports Event", size: "" },
  { src: "public_html/img/tk8.jpeg", alt: "Art and Culture", size: "tall" },
  { src: "public_html/img/tk9.jpeg", alt: "Classroom Activities", size: "wide" },
  { src: "public_html/img/tk10.jpeg", alt: "Outdoor Adventures", size: "" },
  { src: "public_html/img/tk11.jpeg", alt: "Workshops", size: "wide" },
  { src: "public_html/img/tt1.jpg", alt: "Annual Fest", size: "" }
];

// ====== LOAD BOTH STATIC + SERVER IMAGES ======
async function loadGallery() {
  try {
    // Fetch uploaded images from backend
    const res = await fetch("/api/gallery");
    const data = await res.json();

    // Merge static + dynamic images
    const allImages = [...staticImages];

    if (data.success && Array.isArray(data.images)) {
      data.images.forEach(src => {
        allImages.push({ src, alt: "School Moment", size: "" });
      });
    }

    // Render them
    renderGallery(allImages);
  } catch (err) {
    console.error("❌ Error loading gallery:", err);
    renderGallery(staticImages); // fallback
  }
}

// ====== RENDER FUNCTION ======
function renderGallery(images) {
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  galleryWrapper.innerHTML = "";

  images.forEach(img => {
    const div = document.createElement("div");
    div.classList.add("gallery-item");
    if (img.size) div.classList.add(img.size);
    div.dataset.img = img.src;
    div.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    galleryWrapper.appendChild(div);
  });

  setupLightbox();
  animateGallery();
}

// ====== LIGHTBOX FUNCTIONALITY ======
function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const close = lightbox.querySelector(".close");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      lightboxImg.src = item.dataset.img;
      lightbox.style.display = "flex";
    });
  });

  close.addEventListener("click", () => (lightbox.style.display = "none"));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });
}

// ====== GSAP ANIMATION ======
function animateGallery() {
  gsap.utils.toArray(".gallery-item").forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 90%" },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: i * 0.05,
    });
  });
}

// ====== INITIAL LOAD ======
loadGallery();

// Scroll indicator entrance animation
gsap.from(".scroll-indicator", {
  opacity: 0,
  y: 30,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.6,
});
gsap.registerPlugin(ScrollTrigger);

// reveal sections with stagger (sections are .reveal)
gsap.utils.toArray(".reveal").forEach((el, i) => {
  gsap.fromTo(
    el,
    { y: 60, opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      delay: i * 0.05
    }
  );
});