document.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORS ---
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, main');
  const yearSpan = document.getElementById('year');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const progressBar = document.getElementById('progress-bar');
  const timeline = document.getElementById('education-timeline');

  // --- DYNAMIC YEAR ---
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- SCROLL EVENTS & TRACKERS ---
  window.addEventListener('scroll', () => {
    // Header Scroll Styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress Indicator Tracker
    if (progressBar) {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
      progressBar.style.width = `${scrollProgress}%`;
    }

    // Scroll To Top Button visibility
    if (scrollTopBtn) {
      if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
        scrollTopBtn.style.transform = 'translateY(0)';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        scrollTopBtn.style.transform = 'translateY(15px)';
      }
    }
  });

  // Smooth hover scroll-to-top init state
  if (scrollTopBtn) {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.pointerEvents = 'none';
    scrollTopBtn.style.transition = 'opacity 0.3s, transform 0.3s, background-color 0.2s';
  }

  // --- MOBILE NAV TOGGLE ---
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      });
    });
  }

  // --- ACTIVE LINK ON SCROLL (SCROLL SPY) ---
  const scrollSpy = () => {
    let currentActive = '';
    const scrollPosition = window.scrollY + 120; // offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentActive}` || (currentActive === 'home' && href === '#')) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Trigger initially

  // --- REVEAL ON SCROLL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- EDUCATION TIMELINE OBSERVER ---
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('active');
        }
      });
    }, {
      threshold: 0.2
    });
    timelineObserver.observe(timeline);
  }

  // --- TYPEWRITER EFFECT ---
  const typeTarget = document.querySelector('.typewriter-text');
  if (typeTarget) {
    const words = JSON.parse(typeTarget.getAttribute('data-words') || '[]');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typeTarget.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        delay = 75;
      } else {
        typeTarget.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        delay = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        delay = 1800; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 500; // Pause before next word
      }

      setTimeout(type, delay);
    };

    setTimeout(type, 1000);
  }

  // --- DYNAMIC 3D CARD HOVER TILTS ---
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Mouse position relative to card center
      const mouseX = e.clientX - cardRect.left - cardWidth / 2;
      const mouseY = e.clientY - cardRect.top - cardHeight / 2;
      
      // Calculate rotation (max 10 degrees)
      const rotateX = -(mouseY / (cardHeight / 2)) * 8;
      const rotateY = (mouseX / (cardWidth / 2)) * 8;
      
      // Apply 3D tilt
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset transform
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // --- THEME TOGGLER (LIGHT/DARK) ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      } else {
        icon.className = 'fas fa-moon';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  }

  // --- INTERACTIVE LEAF-NETWORK CANVAS PARTICLES (HERO BACKGROUND) ---
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxParticles = 65;

    // Track mouse position
    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particle
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // 1 to 4px
        this.speedX = (Math.random() - 0.5) * 0.5; // slow drift
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Dark theme colors: green and gold
        this.color = Math.random() > 0.35 ? 'rgba(61, 184, 127, 0.25)' : 'rgba(236, 168, 87, 0.2)'; 
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce back from walls
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Mouse interaction: push away slowly
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Init particles
    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    initParticles();

    // Draw network connections (lines)
    const connectParticles = () => {
      const maxDistance = 100;
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            // Draw connecting line
            const opacity = (maxDistance - distance) / maxDistance * 0.15;
            ctx.strokeStyle = `rgba(61, 184, 127, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });

      connectParticles();
      requestAnimationFrame(animate);
    };
    animate();
  }

  // --- CONTACT FORM SUCCESS ANIMATION ---
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.backgroundColor = '#185c3d';
        submitBtn.style.color = '#fff';
        
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1500);
    });
  }

  // --- PARALLAX EFFECT FOR HERO AVATAR ---
  const heroAvatarWrapper = document.querySelector('.hero-avatar-wrapper');
  if (heroAvatarWrapper) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 90;
      const y = (window.innerHeight - e.pageY * 2) / 90;
      
      // Apply subtle parallax movement to the entire avatar wrapper
      heroAvatarWrapper.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});
