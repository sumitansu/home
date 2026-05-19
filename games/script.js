/**
 * Speedabraker Games - Optimized Interactions
 * Smooth transforms, no layout thrashing
 */

// Disable right-click context menu
document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const heroContent = document.getElementById("heroContent");
  const navBox = document.getElementById("navBox");
  const menuBtn = document.getElementById("menuBtn");
  const homeBtn = document.getElementById("homeBtn");
  const closeMenu = document.getElementById("closeMenu");
  const navExpanded = document.getElementById("navExpanded");

  // Menu navigation buttons
  const aboutBtn = document.getElementById("aboutBtn");
  const statusBtn = document.getElementById("statusBtn");
  const gamesBtn = document.getElementById("gamesBtn");

  // Music Section Elements
  const musicBtn = document.getElementById("musicBtn");
  const navMusic = document.getElementById("navMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const closeMusic = document.getElementById("closeMusic");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeFill = document.getElementById("volumeFill");
  const volumeThumb = document.getElementById("volumeThumb");
  const volumeIconContainer = document.querySelector(".volume-icon");

  // ============================================
  // SMOOTH PARALLAX & STARS
  // ============================================
  const background = document.querySelector(".background");
  const starsContainer = document.getElementById("starsContainer");

  // Border Glow Elements
  const glowTop = document.getElementById("glowTop");
  const glowBottom = document.getElementById("glowBottom");
  const glowLeft = document.getElementById("glowLeft");
  const glowRight = document.getElementById("glowRight");

  let currentX = 0,
    currentY = 0;
  let mouseX = 0,
    mouseY = 0;

  // Star Palette: Purple, Violet, Gold, White
  const starColors = ["#a855f7", "#8b5cf6", "#fbbf24", "#ffffff", "#e9d5ff"];

  // Generate Stars
  function generateStars() {
    if (!starsContainer) return;
    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      star.style.backgroundColor = color;
      star.style.color = color;

      star.style.setProperty("--duration", `${Math.random() * 3 + 2}s`);
      starsContainer.appendChild(star);
    }
  }
  generateStars();

  function updateBulge(edge, bulge, dist, posPerpendicular) {
    if (!bulge) return;

    const threshold = 300;
    const baseSize = 25;
    const maxExtension = 75;

    let extension = 0;
    let opacity = 0;

    if (dist < threshold) {
      const intensity = Math.max(0, 1 - dist / threshold);
      extension = intensity * (maxExtension - baseSize);
      opacity = intensity + 0.2;
    } else {
      opacity = 0;
    }

    if (opacity < 0.05) {
      bulge.style.opacity = 0;
      return;
    }

    bulge.style.opacity = opacity;

    if (edge.id === "glowTop") {
      bulge.style.left = `${posPerpendicular}px`;
      bulge.style.top = "0px";
      bulge.style.height = `${baseSize + extension}px`;
      bulge.style.width = `${Math.max(100, extension * 4)}px`;
    } else if (edge.id === "glowBottom") {
      bulge.style.left = `${posPerpendicular}px`;
      bulge.style.bottom = "0px";
      bulge.style.top = "auto";
      bulge.style.height = `${baseSize + extension}px`;
      bulge.style.width = `${Math.max(100, extension * 4)}px`;
    } else if (edge.id === "glowLeft") {
      bulge.style.top = `${posPerpendicular}px`;
      bulge.style.left = "0px";
      bulge.style.width = `${baseSize + extension}px`;
      bulge.style.height = `${Math.max(100, extension * 4)}px`;
    } else if (edge.id === "glowRight") {
      bulge.style.top = `${posPerpendicular}px`;
      bulge.style.right = "0px";
      bulge.style.left = "auto";
      bulge.style.width = `${baseSize + extension}px`;
      bulge.style.height = `${Math.max(100, extension * 4)}px`;
    }
  }

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    background.style.setProperty("--mouse-x", x);
    background.style.setProperty("--mouse-y", y);

    mouseX =
      ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12;
    mouseY =
      ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 12;

    if (glowTop && glowBottom && glowLeft && glowRight) {
      const bulgeTop = glowTop.querySelector(".glow-bulge");
      const bulgeBottom = glowBottom.querySelector(".glow-bulge");
      const bulgeLeft = glowLeft.querySelector(".glow-bulge");
      const bulgeRight = glowRight.querySelector(".glow-bulge");

      updateBulge(glowTop, bulgeTop, e.clientY, e.clientX);
      updateBulge(
        glowBottom,
        bulgeBottom,
        window.innerHeight - e.clientY,
        e.clientX,
      );
      updateBulge(glowLeft, bulgeLeft, e.clientX, e.clientY);
      updateBulge(
        glowRight,
        bulgeRight,
        window.innerWidth - e.clientX,
        e.clientY,
      );
    }
  });

  function animateParallax() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (heroContent) {
      heroContent.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
    requestAnimationFrame(animateParallax);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animateParallax();
  }

  // ============================================
  // NAV MENU - Click to expand/collapse
  // ============================================
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navBox.classList.remove("music-mode");
    navBox.classList.add("expanded");
  });

  closeMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    navBox.classList.remove("expanded");
  });

  // ============================================
  // MENU NAVIGATION BUTTONS (With Delay)
  // ============================================
  function handleNavClick(e, url) {
    e.preventDefault();
    e.stopPropagation();

    document.body.classList.add("blur-out");

    let target = url;
    const isHome = window.location.href.includes("/home/");
    const isAbout = window.location.href.includes("/about/");
    const isGames = window.location.href.includes("/games/");

    if (url === "index.html") {
      if (isAbout) target = "../home/index.html";
      else if (isGames) target = "../home/index.html";
    } else if (url === "about.html") {
      if (isHome) target = "../about/index.html";
      else if (isGames) target = "../about/index.html";
    }

    setTimeout(() => {
      window.location.href = target;
    }, 500);
  }

  statusBtn.addEventListener("click", (e) => handleNavClick(e, "status.html"));

  // ============================================
  // MACOS DOCK EFFECT
  // ============================================
  const menuItems = navExpanded.querySelectorAll(".menu-item");

  menuItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      menuItems.forEach((otherItem, otherIndex) => {
        if (Math.abs(otherIndex - index) === 1) {
          otherItem.classList.add("dock-neighbor");
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      menuItems.forEach((otherItem) => {
        otherItem.classList.remove("dock-neighbor");
      });
    });
  });

  // ============================================
  // KEYBOARD - Escape to close
  // ============================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navBox.classList.remove("expanded");
      navBox.classList.remove("music-mode");
    }
  });

  // ============================================
  // CLICK OUTSIDE
  // ============================================
  document.addEventListener("click", (e) => {
    if (!navBox.contains(e.target)) {
      navBox.classList.remove("expanded");
      navBox.classList.remove("music-mode");
    }
  });

  // ============================================
  // PROXIMITY GLOW EFFECT
  // ============================================
  const glowElements = document.querySelectorAll(
    ".nav-box, .menu-item, .nav-icon-btn, .music-ctrl-btn, .volume-wrapper, .game-card",
  );

  // ============================================
  // MUSIC SECTION LOGIC
  // ============================================

  const bgMusic = document.getElementById("bgMusic");

  // Toggle Music Mode
  if (musicBtn) {
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navBox.classList.remove("expanded");
      navBox.classList.add("music-mode");
    });
  }

  if (closeMusic) {
    closeMusic.addEventListener("click", (e) => {
      e.stopPropagation();
      navBox.classList.remove("music-mode");
    });
  }

  // Play/Pause Toggle
  let isPlaying = false;
  if (playPauseBtn && bgMusic) {
    const storedTime = sessionStorage.getItem("audioTime");
    const storedIsPlaying = sessionStorage.getItem("isPlaying") === "true";
    const storedVolume = localStorage.getItem("audioVolume");

    let currentVol = 0.5;
    if (storedVolume !== null) {
      currentVol = parseFloat(storedVolume);
    }
    bgMusic.volume = currentVol;

    if (volumeFill && volumeThumb) {
      volumeFill.style.width = `${currentVol * 100}%`;
      volumeThumb.style.left = `${currentVol * 100}%`;
    }

    if (volumeIconContainer) {
      let iconSvg = "";
      const baseAttrs =
        'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

      if (currentVol === 0) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>`;
      } else if (currentVol <= 0.5) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
      }
      volumeIconContainer.innerHTML = iconSvg;
    }

    if (storedTime) {
      bgMusic.currentTime = parseFloat(storedTime);
    }

    const syncPlayState = () => {
      if (!bgMusic.paused) {
        playPauseBtn.classList.add("playing");
        isPlaying = true;
        sessionStorage.setItem("isPlaying", "true");
      } else {
        playPauseBtn.classList.remove("playing");
        isPlaying = false;
        sessionStorage.setItem("isPlaying", "false");
      }
    };

    bgMusic.addEventListener("timeupdate", () => {
      sessionStorage.setItem("audioTime", bgMusic.currentTime);
    });

    bgMusic.addEventListener("play", syncPlayState);
    bgMusic.addEventListener("pause", syncPlayState);
    bgMusic.addEventListener("ended", () => {
      sessionStorage.setItem("audioTime", 0);
      sessionStorage.setItem("isPlaying", "false");
    });

    if (storedIsPlaying) {
      let playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            syncPlayState();
          })
          .catch((error) => {
            console.log("Autoplay blocked:", error);
            sessionStorage.setItem("isPlaying", "false");
            syncPlayState();

            const resumeOnInteract = () => {
              bgMusic
                .play()
                .then(() => {
                  syncPlayState();
                })
                .catch(console.error);
              document.removeEventListener("click", resumeOnInteract);
              document.removeEventListener("keydown", resumeOnInteract);
            };

            document.addEventListener("click", resumeOnInteract);
            document.addEventListener("keydown", resumeOnInteract);
          });
      }
    } else {
      syncPlayState();
    }

    playPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        let playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              syncPlayState();
            })
            .catch((error) => {
              console.log("Autoplay prevented or playback error:", error);
            });
        }
      } else {
        bgMusic.pause();
        syncPlayState();
      }
    });
  }

  // Volume Slider Logic
  if (volumeSlider && volumeFill && volumeThumb && bgMusic) {
    let isDragging = false;

    const updateVolume = (clientX) => {
      const rect = volumeSlider.getBoundingClientRect();
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));

      applyVolume(percentage);
      localStorage.setItem("audioVolume", percentage);
    };

    const applyVolume = (percentage) => {
      volumeFill.style.width = `${percentage * 100}%`;
      volumeThumb.style.left = `${percentage * 100}%`;
      bgMusic.volume = percentage;

      if (volumeIconContainer) {
        let iconSvg = "";
        const baseAttrs =
          'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

        if (percentage === 0) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>`;
        } else if (percentage <= 0.5) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
        } else {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
        }

        volumeIconContainer.innerHTML = iconSvg;
      }
    };

    volumeSlider.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateVolume(e.clientX);
      volumeSlider.style.cursor = "grabbing";
      e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updateVolume(e.clientX);
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        volumeSlider.style.cursor = "pointer";
      }
    });

    volumeSlider.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        updateVolume(e.touches[0].clientX);
        e.stopPropagation();
      },
      { passive: false },
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateVolume(e.touches[0].clientX);
      },
      { passive: false },
    );

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    const volumeWrapper = document.querySelector(".volume-wrapper");
    const handleScroll = (e) => {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      const step = 0.05;

      let newVolume = bgMusic.volume + direction * step;
      newVolume = Math.max(0, Math.min(1, newVolume));

      applyVolume(newVolume);
    };

    if (volumeWrapper) {
      volumeWrapper.addEventListener("wheel", handleScroll, { passive: false });
    }
    volumeSlider.addEventListener("wheel", handleScroll, { passive: false });
  }

  document.addEventListener("mousemove", (e) => {
    glowElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    });
  });

  // ============================================
  // GAME CARD TILT ANIMATION
  // ============================================
  const cards = document.querySelectorAll(".game-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
  // ============================================
  // JS PHYSICS-BASED WAVE ANIMATION
  // ============================================
  const gamesContainer = document.querySelector(".games-container");
  const cardWrappers = document.querySelectorAll(".card-float-wrapper");

  if (gamesContainer && cardWrappers.length > 0) {
    let time = 0;
    let currentAmp = 20; // Start with full amplitude
    let targetAmp = 20;
    const speed = 0.02; // Speed of the wave
    const dampSpeed = 0.05; // Speed of amplitude transition (dampening)

    // Offsets for 4 columns (PI/2 increments)
    const offsets = [
      0,                 // Card 0 (Top Col 1)
      Math.PI / 2,       // Card 1 (Top Col 2)
      Math.PI,           // Card 2 (Top Col 3)
      (3 * Math.PI) / 2, // Card 3 (Top Col 4)
      0,                 // Card 4 (Bottom Col 1)
      Math.PI / 2,       // Card 5 (Bottom Col 2)
      Math.PI,           // Card 6 (Bottom Col 3)
      (3 * Math.PI) / 2  // Card 7 (Bottom Col 4)
    ];

    function animateWave() {
      // Smoothly interpolate amplitude
      currentAmp += (targetAmp - currentAmp) * dampSpeed;

      // Keep time running to preserve phase
      time += speed;

      cardWrappers.forEach((wrapper, index) => {
        // Top Row (0-3) moves UP first (-y)
        // Bottom Row (4-7) moves DOWN first (+y)
        const isTop = index < 4;
        const direction = isTop ? -1 : 1;
        
        const offset = offsets[index] || 0;
        
        // If amp is practically 0, snap to 0 to save processing visually, 
        // but we still need to calculate transform generally if we want perfect resume?
        // Actually, sin * 0 is 0. So it works.
        
        const y = Math.sin(time + offset) * currentAmp * direction;

        wrapper.style.transform = `translateY(${y}px)`;
      });

      requestAnimationFrame(animateWave);
    }

    // Start Loop
    animateWave();

    // Event Listeners for Dampening
    gamesContainer.addEventListener("mouseenter", () => {
      targetAmp = 0; // Smoothly shrink to line
    });

    gamesContainer.addEventListener("mouseleave", () => {
      targetAmp = 20; // Smoothly resume wave
    });
  }

});
