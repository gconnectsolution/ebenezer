gsap.utils.toArray(".parallax-section").forEach(section => {
  const glass = section.querySelector(".glass");

  gsap.fromTo(
    glass,
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "center center",
        toggleActions: "play none none reverse",
      }
    }
  );

  gsap.to(section, {
    backgroundPositionY: "40%",
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    }
  });
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