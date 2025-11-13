// auth.js

// GSAP animations
gsap.from(".login-left", { opacity: 0, x: -80, duration: 1.2, ease: "power3.out" });
gsap.from(".login-right", { opacity: 0, x: 80, duration: 1.2, ease: "power3.out", delay: 0.3 });
gsap.from(".login-box", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.6 });

// Form handler
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginBtn = e.target.querySelector(".login-btn");
  const originalText = loginBtn.textContent;

  // Loading state
  loginBtn.textContent = "Signing In...";
  loginBtn.disabled = true;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      localStorage.setItem("authToken", data.token);
      window.location.href = "/admin.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("Network error. Please check your connection and try again.");
  } finally {
    // Reset button
    loginBtn.textContent = originalText;
    loginBtn.disabled = false;
  }
});

//gsap.registerPlugin(ScrollTrigger);

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