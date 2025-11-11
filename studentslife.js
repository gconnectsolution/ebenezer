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
