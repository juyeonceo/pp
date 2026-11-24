/**
 * ============================================================================
 * LUXURY PRESTIGE - JAVASCRIPT ORCHESTRATION
 * "YOUR FOCUS IS YOUR FORTUNE"
 * Lenis Smooth Scroll | GSAP ScrollTrigger | Three.js | Parallax | Themes
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Set Current Dynamic Year in Footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
   * 1. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER SYNC
   * -------------------------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Synchronize Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /* --------------------------------------------------------------------------
   * 2. CUSTOM LUXURY CURSOR
   * -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .service-card, .luxury-stacked-card');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --------------------------------------------------------------------------
   * 3. THEME TOGGLE (LIGHT / DARK LUXURY)
   * -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('luxury-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  const updateThemeUI = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('luxury-theme', theme);
    if (window.updateThreeTheme) {
      window.updateThreeTheme(theme);
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      updateThemeUI(nextTheme);
    });
  }

  /* --------------------------------------------------------------------------
   * 4. HEADER NAVIGATION & SMOOTH SCROLLING
   * -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .header-cta, .hero-cta-group a, .footer-links a, .hero-crest-badge a');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky Scrolled Header styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });
  }

  // Smooth Scroll on Click with Lenis
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            mobileToggle.classList.remove('active');
          }

          const targetOffset = target.offsetTop - (header.offsetHeight || 70);
          lenis.scrollTo(targetOffset, {
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    });
  });

  // ScrollSpy Active Link indicator
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach((lnk) => {
          lnk.classList.remove('active');
          if (lnk.getAttribute('href') === `#${id}`) {
            lnk.classList.add('active');
          }
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 5. SCROLL TO TOP WITH CIRCULAR PROGRESS GAUGE
   * -------------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressCircle = document.getElementById('progressCircle');
  const totalLength = 2 * Math.PI * 24; // r = 24 => ~150.796

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${totalLength}`;
    progressCircle.style.strokeDashoffset = `${totalLength}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    // Show/Hide Button
    if (scrollTopBtn) {
      if (currentScroll > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Update Progress Ring
    if (progressCircle && scrollTotal > 0) {
      const scrollFraction = Math.min(Math.max(currentScroll / scrollTotal, 0), 1);
      const offset = totalLength - (scrollFraction * totalLength);
      progressCircle.style.strokeDashoffset = offset;
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, {
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 6. THREE.JS INTERACTIVE 3D HERO (GOLD PARTICLES & VELVET AMBIENCE)
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles Geometry
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const goldColor = new THREE.Color('#D4AF37');
    const goldLight = new THREE.Color('#FFF1BF');
    const velvetColor = new THREE.Color('#7B2CBF');
    const royalDeep = new THREE.Color('#38006b');

    for (let i = 0; i < particleCount; i++) {
      // Golden Spiral distribution
      const i3 = i * 3;
      const radius = 20 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color variation: 65% Gold, 35% Velvet Violet
      let mixedColor;
      if (Math.random() > 0.35) {
        mixedColor = goldColor.clone().lerp(goldLight, Math.random() * 0.7);
      } else {
        mixedColor = velvetColor.clone().lerp(royalDeep, Math.random() * 0.5);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 2.2 + 0.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Texture creation programmatically (glowing smooth circle)
    const getParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,240,190,0.85)');
      grad.addColorStop(0.7, 'rgba(212,175,55,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const material = new THREE.PointsMaterial({
      size: 2.4,
      map: getParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Inner Velvet Floating Ring / Torus
    const ringGeo = new THREE.TorusGeometry(32, 1.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Mouse movement interaction
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
      targetX = (event.clientX - windowHalfX) * 0.035;
      targetY = (event.clientY - windowHalfY) * 0.035;
    });

    // Theme adjustment function for Three.js
    window.updateThreeTheme = (theme) => {
      if (theme === 'light') {
        material.blending = THREE.NormalBlending;
        material.opacity = 0.65;
        ringMat.opacity = 0.08;
      } else {
        material.blending = THREE.AdditiveBlending;
        material.opacity = 0.88;
        ringMat.opacity = 0.12;
      }
    };
    window.updateThreeTheme(savedTheme);

    // Animation Loop
    const clock = new THREE.Clock();
    const animateThree = () => {
      requestAnimationFrame(animateThree);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle rotation
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = elapsedTime * 0.015;

      ringMesh.rotation.z = elapsedTime * 0.06;
      ringMesh.rotation.y = elapsedTime * 0.03;

      // Mouse responsive inertia (Lerp)
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animateThree();

    // Window Resize
    window.addEventListener('resize', () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* --------------------------------------------------------------------------
   * 7. GSAP SCROLLTRIGGER ANIMATIONS & PARALLAX
   * -------------------------------------------------------------------------- */

  // Hero Section Entrance Animation
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .from('.hero-crest-badge', { y: -30, opacity: 0, duration: 1.2, delay: 0.2 })
    .from('.hero-title .title-word', {
      y: 60,
      opacity: 0,
      duration: 1.3,
      stagger: 0.12,
    }, '-=0.8')
    .from('.hero-description', { y: 30, opacity: 0, duration: 1.1 }, '-=0.9')
    .from('.hero-cta-group', { y: 30, opacity: 0, duration: 1 }, '-=0.8')
    .from('.hero-stats-bar', { scale: 0.92, opacity: 0, duration: 1.2 }, '-=0.7')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.5');

  // Parallax elements with data-parallax
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
    gsap.to(el, {
      y: () => -120 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });

  // Stacked Cards in Philosophy Section
  gsap.to('.card-primary', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.philosophy-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.card-secondary', {
    y: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.philosophy-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Numbers Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target')) || 0;
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          duration: 2.2,
          innerHTML: target,
          ease: 'power2.out',
          snap: isDecimal ? { innerHTML: 0.1 } : { innerHTML: 1 },
          onUpdate: function () {
            counter.innerHTML = isDecimal ? parseFloat(this.targets()[0].innerHTML).toFixed(1) : Math.ceil(this.targets()[0].innerHTML);
          },
        });
      },
    });
  });

  // Services Cards Stagger Reveal
  gsap.fromTo('.service-card', 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        once: true,
      },
      onComplete: () => {
        gsap.set('.service-card', { clearProps: 'opacity' });
      }
    }
  );

  // Parallax Showcase Items
  document.querySelectorAll('.showcase-item').forEach((item) => {
    const media = item.querySelector('.showcase-media-wrap');
    const info = item.querySelector('.showcase-info');

    gsap.from(media, {
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
      },
      scale: 0.94,
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    });

    gsap.from(info, {
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
      },
      x: item.classList.contains('reverse') ? -40 : 40,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out',
    });
  });

  // PINNED VISION SECTION (YOUR FOCUS IS YOUR FORTUNE Text Scrub)
  const visionWords = document.querySelectorAll('.scrub-word');
  if (visionWords.length > 0) {
    ScrollTrigger.create({
      trigger: '#visionPin',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalWords = visionWords.length;
        const activeCount = Math.floor(progress * totalWords * 1.2);

        visionWords.forEach((word, index) => {
          if (index <= activeCount) {
            word.classList.add('active');
          } else {
            word.classList.remove('active');
          }
        });
      },
    });
  }

  // Contact Section Reveal
  gsap.from('.contact-card-wrapper', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  });

  /* --------------------------------------------------------------------------
   * 8. 3D CARD MOUSE TILT INTERACTION
   * -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // Refresh ScrollTrigger calculations after full window load & fonts ready
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

/**
 * Handle Private Inquiry Form Submission
 */
function handleFormSubmit() {
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccessMsg');
  const inquiryForm = document.getElementById('inquiryForm');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'SECURING TRANSMISSION...';
  }

  setTimeout(() => {
    if (successMsg) {
      successMsg.classList.add('visible');
    }
    if (submitBtn) {
      submitBtn.style.display = 'none';
    }
    if (inquiryForm) {
      inquiryForm.reset();
    }
    // Re-trigger lucide icons inside success message
    if (window.lucide) {
      lucide.createIcons();
    }
  }, 1200);
}
