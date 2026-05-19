/**
 * Speedabraker - Optimized Interactions
 * Smooth transforms, no layout thrashing
 */

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  const heroContent = document.getElementById('heroContent');
  const navBox = document.getElementById('navBox');
  const menuBtn = document.getElementById('menuBtn');
  const homeBtn = document.getElementById('homeBtn');
  const closeMenu = document.getElementById('closeMenu');
  const socialBox = document.getElementById('socialBox');
  const navExpanded = document.getElementById('navExpanded');
  
  // Menu navigation buttons
  const aboutBtn = document.getElementById('aboutBtn');
  const statusBtn = document.getElementById('statusBtn');
  const gamesBtn = document.getElementById('gamesBtn');
  
  // Music Section Elements
  const musicBtn = document.getElementById('musicBtn');
  const navMusic = document.getElementById('navMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const closeMusic = document.getElementById('closeMusic');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeFill = document.getElementById('volumeFill');
  const volumeThumb = document.getElementById('volumeThumb');
  const volumeIconContainer = document.querySelector('.volume-icon');
  
  // ============================================
  // SMOOTH PARALLAX & STARS
  // ============================================
  const background = document.querySelector('.background');
  const starsContainer = document.getElementById('starsContainer');
  
  // Border Glow Elements
  const glowTop = document.getElementById('glowTop');
  const glowBottom = document.getElementById('glowBottom');
  const glowLeft = document.getElementById('glowLeft');
  const glowRight = document.getElementById('glowRight');

  let currentX = 0, currentY = 0;
  let mouseX = 0, mouseY = 0;

  // Star Palette: Purple, Violet, Gold, White
  const starColors = ['#a855f7', '#8b5cf6', '#fbbf24', '#ffffff', '#e9d5ff'];

  // Generate Stars
  function generateStars() {
    if (!starsContainer) return;
    const starCount = 80; // More stars for the darker background
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2 + 1; // 1px to 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random Color from palette
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        star.style.backgroundColor = color;
        star.style.color = color; // For box-shadow inheritance
        
        // Random animation duration
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`); 
        starsContainer.appendChild(star);
    }
  }
  generateStars();

  function updateBulge(edge, bulge, dist, posPerpendicular) {
    if (!bulge) return;
    
    // Proximity logic
    const threshold = 300; 
    const baseSize = 25; // Matching CSS
    const maxExtension = 75; // Total max size (25 base + 50 extra)
    
    let extension = 0;
    let opacity = 0;
    
    if (dist < threshold) {
        // Calculate extension curve (peak at 0 dist for this "piping" effect)
        // Or peak at closer range as per user "max it will go till 200px" -> meaning at 200px from border it ENDS?
        // User said: "max it will go till 200px more closed the mouse it stretch more and at 200 px from border it meets with mouse"
        // This implies the bulge REACHES the mouse if mouse is < 200px away?
        // Let's interpret "stretch towards it":
        // If dist < 200, height = dist (meets mouse)
        // If dist > 200, shrink back.
        // But also "getting more closer will readily in again shrinking"
        // So peak is at some distance?
        
        // Let's stick to a solid interactive feel:
        // Peak stretch at ~100px distance? 
        // Let's try to make it reach towards mouse.
        
        const intensity = Math.max(0, 1 - (dist / threshold)); // 0 to 1
        
        // Stretch size
        // If dist is small, we want it to look "connected" or just huge?
        // Let's simple bulge logic: closer = bigger, up to 75px.
        extension = intensity * (maxExtension - baseSize);
        opacity = intensity + 0.2; // Always some opacity if close
    } else {
        opacity = 0; // Hide bulge if far
    }
    
    // Safety check
    if (opacity < 0.05) {
        bulge.style.opacity = 0;
        return;
    }

    bulge.style.opacity = opacity;
    
    // Orientation specific
    if (edge.id === 'glowTop') {
        bulge.style.left = `${posPerpendicular}px`;
        bulge.style.top = '0px'; 
        bulge.style.height = `${baseSize + extension}px`;
        bulge.style.width = `${Math.max(100, extension * 4)}px`; // Make it wider as it grows
    } else if (edge.id === 'glowBottom') {
        bulge.style.left = `${posPerpendicular}px`;
        bulge.style.bottom = '0px';
        bulge.style.top = 'auto';
        bulge.style.height = `${baseSize + extension}px`;
        bulge.style.width = `${Math.max(100, extension * 4)}px`;
    } else if (edge.id === 'glowLeft') {
        bulge.style.top = `${posPerpendicular}px`;
        bulge.style.left = '0px';
        bulge.style.width = `${baseSize + extension}px`;
        bulge.style.height = `${Math.max(100, extension * 4)}px`;
    } else if (edge.id === 'glowRight') {
        bulge.style.top = `${posPerpendicular}px`;
        bulge.style.right = '0px';
        bulge.style.left = 'auto';
        bulge.style.width = `${baseSize + extension}px`;
        bulge.style.height = `${Math.max(100, extension * 4)}px`;
    }
  }

  document.addEventListener('mousemove', (e) => {
    // Normalized coordinates
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    background.style.setProperty('--mouse-x', x);
    background.style.setProperty('--mouse-y', y);
    
    // Parallax values for Hero
    mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 12;
    mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * 12;

    // Interactive Border Glow Calculation
    if (glowTop && glowBottom && glowLeft && glowRight) {
        const bulgeTop = glowTop.querySelector('.glow-bulge');
        const bulgeBottom = glowBottom.querySelector('.glow-bulge');
        const bulgeLeft = glowLeft.querySelector('.glow-bulge');
        const bulgeRight = glowRight.querySelector('.glow-bulge');

        updateBulge(glowTop, bulgeTop, e.clientY, e.clientX);
        updateBulge(glowBottom, bulgeBottom, window.innerHeight - e.clientY, e.clientX);
        updateBulge(glowLeft, bulgeLeft, e.clientX, e.clientY);
        updateBulge(glowRight, bulgeRight, window.innerWidth - e.clientX, e.clientY);
    }
  });
  
  function animateParallax() {
    // Smooth lerp for Hero Content
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    
    if (heroContent) {
        heroContent.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
    requestAnimationFrame(animateParallax);
  }
  
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateParallax();
  }
  
  // ============================================
  // NAV MENU - Click to expand/collapse with flip
  // ============================================
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navBox.classList.remove('music-mode');
    navBox.classList.add('expanded');
  });
  
  closeMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navBox.classList.remove('expanded');
  });
  
  // ============================================
  // MENU NAVIGATION BUTTONS (With Delay)
  // ============================================
  function handleNavClick(e, url) {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate triggers if any
    
    // Add blur-out class to body
    document.body.classList.add('blur-out');
    
    // Detect if we are in a subdirectory (like /about/)
    // This is a simple heuristic: if we are not in home root.
    // However, simplest way given the structure:
    // Home is at speedabraker.in/home/index.html
    // About is at speedabraker.in/about/index.html
    // Script is at speedabraker.in/home/script.js
    
    // If we are navigating to 'index.html' (Home), and we are in 'about', we need '../home/index.html'
    // If we are navigating to 'about.html' (About), and we are in 'home', we need '../about/index.html'
    // Wait, the user file structure says: 
    // home/index.html
    // about/index.html
    
    // Let's make the URLs absolute relative to project root if possible, or handle relative logic.
    let target = url;
    const isHome = window.location.href.includes('/home/');
    const isAbout = window.location.href.includes('/about/');
    
    if (url === 'index.html') {
      // Intent: Go Home
      if (isAbout) target = '../home/index.html';
    } else if (url === 'about.html') {
      // Intent: Go About
      if (isHome) target = '../about/index.html';
      else if (isAbout) target = 'index.html'; // Or just reload
    }
    // For status/games, assuming they are in root or similar folders? 
    // User hasn't specified yet. Leaving as is or assuming same folder level as home?
    // Let's assume they are peers to home/about for now or inside home?
    // "status.html" appeared in original button. 
    // If they don't exist yet, it's fine.
    
    setTimeout(() => {
      window.location.href = target;
    }, 500);
  }

  // aboutBtn.addEventListener('click', (e) => handleNavClick(e, 'about.html')); // REPLACED WITH DIRECT LINK
  statusBtn.addEventListener('click', (e) => handleNavClick(e, 'status.html'));
  gamesBtn.addEventListener('click', (e) => handleNavClick(e, 'games.html'));
  
  // Home button
  // homeBtn.addEventListener('click', (e) => handleNavClick(e, 'index.html')); // REPLACED WITH DIRECT LINK
  
  // ============================================
  // MACOS DOCK EFFECT
  // ============================================
  const menuItems = navExpanded.querySelectorAll('.menu-item');
  
  menuItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      // Add dock-neighbor class to adjacent items
      menuItems.forEach((otherItem, otherIndex) => {
        if (Math.abs(otherIndex - index) === 1) {
          otherItem.classList.add('dock-neighbor');
        }
      });
    });
    
    item.addEventListener('mouseleave', () => {
      // Remove dock-neighbor class from all items
      menuItems.forEach(otherItem => {
        otherItem.classList.remove('dock-neighbor');
      });
    });
  });
  
  // ============================================
  // SOCIAL - Hover to expand (desktop)
  // ============================================
  // Mobile tap toggle
  if (window.innerWidth < 640) {
    socialBox.addEventListener('click', (e) => {
      if (!e.target.closest('.social-link')) {
        socialBox.classList.toggle('open');
      }
    });
  }
  
  // ============================================
  // KEYBOARD - Escape to close
  // ============================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navBox.classList.remove('expanded');
      navBox.classList.remove('music-mode');
      socialBox.classList.remove('open');
    }
  });
  
  // ============================================
  // CLICK OUTSIDE
  // ============================================
  document.addEventListener('click', (e) => {
    if (!navBox.contains(e.target)) {
      navBox.classList.remove('expanded');
      navBox.classList.remove('music-mode');
    }
    if (!socialBox.contains(e.target)) {
      socialBox.classList.remove('open');
    }
  });

  // ============================================
  // PROXIMITY GLOW EFFECT
  // ============================================
  const glowElements = document.querySelectorAll('.nav-box, .social-box, .social-expanded, .menu-item, .nav-icon-btn, .social-link, .music-ctrl-btn, .volume-wrapper');

  // ============================================
  // MUSIC SECTION LOGIC
  // ============================================
  
  const bgMusic = document.getElementById('bgMusic');

  // Toggle Music Mode
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navBox.classList.remove('expanded'); // Close menu if open
      navBox.classList.add('music-mode');
    });
  }

  if (closeMusic) {
    closeMusic.addEventListener('click', (e) => {
      e.stopPropagation();
      navBox.classList.remove('music-mode');
    });
  }
  
  // Play/Pause Toggle
  let isPlaying = false;
  if (playPauseBtn && bgMusic) {
    // ============================================
    // PERSISTENT AUDIO LOGIC
    // ============================================
    // Use sessionStorage for session-specific state (Time, IsPlaying)
    // so it resets when browser is closed (starts from beginning).
    const storedTime = sessionStorage.getItem('audioTime');
    const storedIsPlaying = sessionStorage.getItem('isPlaying') === 'true';
    
    // Use localStorage for Volume (User Preference should persist forever)
    const storedVolume = localStorage.getItem('audioVolume');

    // Restore Volume (Default 0.5)
    let currentVol = 0.5;
    if (storedVolume !== null) {
      currentVol = parseFloat(storedVolume);
    }
    bgMusic.volume = currentVol;
    
    // Sync Slider UI to restored volume
    if (volumeFill && volumeThumb) {
        volumeFill.style.width = `${currentVol * 100}%`;
        volumeThumb.style.left = `${currentVol * 100}%`;
    }
    
    // Update Icon for restored volume
    const volumeIconContainer = document.querySelector('.volume-icon');
    if (volumeIconContainer) {
        let iconSvg = '';
        const baseAttrs = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        
        if (currentVol === 0) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>`;
        } else if (currentVol <= 0.5) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
        } else {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
        }
        volumeIconContainer.innerHTML = iconSvg;
    }

    // Restore Time (only if session is active)
    if (storedTime) {
      bgMusic.currentTime = parseFloat(storedTime);
    }

    const syncPlayState = () => {
      if (!bgMusic.paused) {
        playPauseBtn.classList.add('playing');
        isPlaying = true;
        sessionStorage.setItem('isPlaying', 'true');
      } else {
        playPauseBtn.classList.remove('playing');
        isPlaying = false;
        sessionStorage.setItem('isPlaying', 'false');
      }
    };

    // Save time frequently (to sessionStorage)
    bgMusic.addEventListener('timeupdate', () => {
      sessionStorage.setItem('audioTime', bgMusic.currentTime);
    });
    
    // Save state
    bgMusic.addEventListener('play', syncPlayState);
    bgMusic.addEventListener('pause', syncPlayState);
    bgMusic.addEventListener('ended', () => {
        sessionStorage.setItem('audioTime', 0);
        sessionStorage.setItem('isPlaying', 'false');
    });

    // Attempt restoration
    if (storedIsPlaying) {
      let playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          syncPlayState();
        })
        .catch(error => {
          console.log("Autoplay blocked:", error);
          sessionStorage.setItem('isPlaying', 'false');
          syncPlayState();
          
          // Fallback: Resume on first interaction
          const resumeOnInteract = () => {
            bgMusic.play().then(() => {
                syncPlayState();
            }).catch(console.error);
            document.removeEventListener('click', resumeOnInteract);
            document.removeEventListener('keydown', resumeOnInteract);
          };
          
          document.addEventListener('click', resumeOnInteract);
          document.addEventListener('keydown', resumeOnInteract);
        });
      }
    } else {
       syncPlayState();
    }
    
    // CLICK TO ENTER - SIMPLIFIED FOR PERFORMANCE
    // If we already restored playing, we might not need click-overlay sound trigger?
    // Or we keep it for valid "first interaction" policy.
    const clickOverlay = document.getElementById('click-overlay');

    // INTRO PERSISTENCE: Check if already entered
    if (clickOverlay) {
        if (sessionStorage.getItem('hasEntered') === 'true') {
            clickOverlay.style.display = 'none'; // Instant hide
            // We can try to autoplay if allowed, since we are in a trusted session?
            // Usually still needs interaction, but if music persistence is on, it might work.
        } else {
             clickOverlay.addEventListener('click', () => {
                // Play Music if not already playing or just ensure interactions are unlocked
                if (bgMusic.paused) {
                    bgMusic.play().then(() => {
                        syncPlayState();
                    }).catch(console.error);
                }
                
                // Set flag
                sessionStorage.setItem('hasEntered', 'true');

                // Simple fade out
                clickOverlay.classList.add('fade-out');
                
                // Remove after transition
                setTimeout(() => {
                  clickOverlay.remove();
                }, 600);
              });
        }
    }

    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        let playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            syncPlayState();
          })
          .catch(error => {
            console.log("Autoplay prevented or playback error:", error);
          });
        }
      } else {
        bgMusic.pause();
        syncPlayState();
      }
    });

    // Ensure icon stays in sync if audio stops for other reasons
    // (Handled by 'play'/'pause' listeners above now)
  }
  
  // Volume Slider Logic (Drag + Scroll)
  if (volumeSlider && volumeFill && volumeThumb && bgMusic) {
    let isDragging = false;
    
    // Function to calculate and apply volume
    const updateVolume = (clientX) => {
      const rect = volumeSlider.getBoundingClientRect();
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage)); // Clamp 0-1
      
      applyVolume(percentage);
      
      // SAVE VOLUME
      localStorage.setItem('audioVolume', percentage);
    };

    const applyVolume = (percentage) => {
      volumeFill.style.width = `${percentage * 100}%`;
      volumeThumb.style.left = `${percentage * 100}%`;
      bgMusic.volume = percentage;

      // Dynamic Icon Update
      if (volumeIconContainer) {
        let iconSvg = '';
        const baseAttrs = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        
        if (percentage === 0) {
          // Volume X
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>`;
        } else if (percentage <= 0.5) {
          // Volume 1
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
        } else {
          // Volume 2
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" ${baseAttrs} class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
        }

        volumeIconContainer.innerHTML = iconSvg;
      }
    };
    
    // Drag Start
    volumeSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateVolume(e.clientX);
      volumeSlider.style.cursor = 'grabbing';
      e.stopPropagation(); // Prevent bubbling issues
    });
    
    // Drag Move
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updateVolume(e.clientX);
    });
    
    // Drag End
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        volumeSlider.style.cursor = 'pointer';
      }
    });
    
    // Touch support - Start
    volumeSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateVolume(e.touches[0].clientX);
      e.stopPropagation();
    }, { passive: false });
    
    // Touch Move
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault(); // crucial for preventing scroll on mobile while dragging slider
      updateVolume(e.touches[0].clientX);
    }, { passive: false });
     
    // Touch End
    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Scroll Support (Mouse Wheel)
    const volumeWrapper = document.querySelector('.volume-wrapper');
    const handleScroll = (e) => {
      e.preventDefault();
      // Determine direction: negative deltaY is scrolling up (increase volume)
      const direction = e.deltaY < 0 ? 1 : -1;
      const step = 0.05; // 5% change per step
      
      let newVolume = bgMusic.volume + (direction * step);
      newVolume = Math.max(0, Math.min(1, newVolume));
      
      applyVolume(newVolume);
    };

    // Add scroll listener to both wrapper and slider for better UX
    if (volumeWrapper) {
      volumeWrapper.addEventListener('wheel', handleScroll, { passive: false });
    }
    volumeSlider.addEventListener('wheel', handleScroll, { passive: false });
  }



  document.addEventListener('mousemove', (e) => {
    glowElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    });
  });
});
