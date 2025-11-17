// ====== STATIC IMAGES (already in your project) ======
const staticImages = [
  { src: "public_html/img/event-.3.jpeg", alt: "Annual Day Celebration", size: "tall", description: "A glimpse of the Annual Day Celebration event." },
  { src: "public_html/img/T1.jpg", alt: "Science Exhibition", size: "wide", description: "Students presenting models at the science exhibition." },
  { src: "public_html/img/tk.jpeg", alt: "Sports Event", size: "", description: "Students participating in a sports event." },
  { src: "public_html/img/tk1.jpeg", alt: "Art and Culture", size: "tall", description: "Showcasing creativity during the art and culture program." },
  { src: "public_html/img/tk2.jpeg", alt: "Classroom Activities", size: "wide", description: "Engaging classroom learning activities." },
  { src: "public_html/img/tk3.jpeg", alt: "Outdoor Adventures", size: "", description: "Students enjoying outdoor adventure activities." },
  { src: "public_html/img/tk4.jpeg", alt: "Workshops", size: "wide", description: "Hands-on learning during various workshops." },
  { src: "public_html/img/tk5.jpeg", alt: "Annual Fest", size: "", description: "Celebrations and performances at the annual fest." },
  { src: "public_html/img/tk6.jpeg", alt: "Science Exhibition", size: "wide", description: "Another view from the science exhibition event." },
  { src: "public_html/img/tk7.jpeg", alt: "Sports Event", size: "", description: "Highlights from different sports competitions." },
  { src: "public_html/img/tk8.jpeg", alt: "Art and Culture", size: "wide", description: "Cultural performances and artistic displays." },
  { src: "public_html/img/tk9.jpeg", alt: "Classroom Activities", size: "wide", description: "Classroom interactions and group activities." },
  { src: "public_html/img/tk10.jpeg", alt: "Outdoor Adventures", size: "", description: "Fun and learning combined during outdoor activities." },
  { src: "public_html/img/tk11.jpeg", alt: "Workshops", size: "wide", description: "Students participating in skill-building workshops." },
  { src: "public_html/img/tt1.jpg", alt: "Annual Fest", size: "", description: "Memories from the vibrant annual festival." }
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
      data.images.forEach(img => {
      allImages.push({
        src: img.src,
        alt: img.alt || "School Moment",
        size: img.size || "",
        description: img.description || "No description"
      });
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

    div.innerHTML = `
      <img src="${img.src}" alt="${img.alt}">
      <div class="img-description">${img.description || "No description available"}</div>
    `;

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

const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navbarMenu.classList.toggle('active');
});

// Close menu on link click (mobile)
document.querySelectorAll('.navbar__menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      hamburger.classList.remove('active');
      navbarMenu.classList.remove('active');
    }
  });
});

// Navbar scroll effect (optional - adds background on scroll)
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(0, 0, 0, 0)';
  } else {
    navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))';
  }
});

// GSAP ScrollTrigger for panels (if not already)