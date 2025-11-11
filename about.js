document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initial Hero Text Fade Up
    gsap.fromTo(".page-hero__content h1", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(".page-hero__content p", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );

    // 2. Generic Scroll Fade In
    gsap.utils.toArray('[data-scroll-fade]').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, y: 30 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2,
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 3. Scroll Pop Effect (For Motto Box)
    gsap.utils.toArray('[data-scroll-pop]').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, scale: 0.8 }, 
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 4. Slide-In Effects (For Split Content)
    gsap.utils.toArray('[data-scroll-slide-left]').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, x: -100 }, 
            { 
                opacity: 1, 
                x: 0, 
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    gsap.utils.toArray('[data-scroll-slide-right]').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, x: 100 }, 
            { 
                opacity: 1, 
                x: 0, 
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
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