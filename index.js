// script.js
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

// optional: subtle hero video parallax while scrolling (non-invasive)
const heroVideo = document.querySelector(".hero__video");
if (heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      const t = self.progress; // 0 -> 1
      heroVideo.style.transform = `translateY(${t * -8}px) scale(${1 + t * 0.012})`;
    }
  });
}

// enhance tile hover on pointermove (desktop)
if (!window.matchMedia("(pointer: coarse)").matches) {
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("mousemove", (e) => {
      const r = tile.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform = `translateZ(0) perspective(800px) rotateX(${ -py * 4 }deg) rotateY(${ px * 6 }deg)`;
    });
    tile.addEventListener("mouseleave", () => {
      tile.style.transform = "";
    });
  });
}


// requires GSAP & ScrollTrigger scripts
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".panel").forEach((panel, i) => {
  const content = panel.querySelector(".panel-content");

  // fade & slide text in
  gsap.fromTo(
    content,
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: panel,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    }
  );

  // zoom background for cinematic parallax
  gsap.fromTo(
    panel,
    { backgroundSize: "100%" },
    {
      backgroundSize: "110%",
      ease: "none",
      scrollTrigger: {
        trigger: panel,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});


  // Light parallax effect on mouse move
  document.querySelectorAll('.initiative-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.transform = `perspective(700px) rotateY(${(x - rect.width/2)/25}deg) rotateX(${-(y - rect.height/2)/25}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });


  // index.js (Add this to your index.js or create if missing)

// Hamburger menu toggle
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