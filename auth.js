// auth.js

// GSAP animations
gsap.from(".login-left", { opacity: 0, x: -80, duration: 1.2, ease: "power3.out" });
gsap.from(".login-right", { opacity: 0, x: 80, duration: 1.2, ease: "power3.out", delay: 0.3 });
gsap.from(".login-box", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.6 });

// Form handler
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
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
      body: JSON.stringify({ email, password }),
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