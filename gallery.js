// ====== GALLERY IMAGES ARRAY ======
const galleryImages = [
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

// ====== GENERATE GALLERY ITEMS ======
const galleryWrapper = document.querySelector(".gallery-wrapper");

galleryImages.forEach((img) => {
  const div = document.createElement("div");
  div.classList.add("gallery-item");
  if (img.size) div.classList.add(img.size);
  div.dataset.img = img.src;
  div.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
  galleryWrapper.appendChild(div);
});

// ====== GSAP ANIMATION ======
gsap.utils.toArray(".gallery-item").forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: { trigger: item, start: "top 90%" },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: i * 0.05
  });
});

// ====== LIGHTBOX ======
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `
  <span class="close">&times;</span>
  <img class="lightbox-img" src="" alt="">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector(".lightbox-img");
const close = lightbox.querySelector(".close");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.img;
    lightbox.style.display = "flex";
  });
});

close.addEventListener("click", () => lightbox.style.display = "none");
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

// Scroll indicator entrance animation
gsap.from(".scroll-indicator", {
  opacity: 0,
  y: 30,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.6
});
