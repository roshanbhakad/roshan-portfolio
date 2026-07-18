/* ==========================================================================
   Roshan Bhakad Portfolio - Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Animate hamburger lines
    const bars = mobileToggle.querySelectorAll('.bar');
    if (mobileToggle.classList.contains('active')) {
      bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      const bars = mobileToggle.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    });
  });


  // 2. Typing Animation Effect
  const words = ["AI & ML Engineer", "Mechatronics Enthusiast", "Full-Stack Developer", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingText = document.getElementById('typing-text');
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // Delete faster
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }
  
  if (typingText) {
    type();
  }


  // 3. Canvas Particle Engine (Interactive Tech Background)
  const canvas = document.getElementById('hero-particles');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const particleCount = 70;
  const connectionDistance = 110;
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // 1 to 3px
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 10;
      
      // Speeds
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
    }

    draw() {
      ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Move particles
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive push/pull effect
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Push particles slightly away from cursor
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 1.5;
          let directionY = forceDirectionY * force * 1.5;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // Connections fade out the further they are
          let opacity = (1 - (distance / connectionDistance)) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();


  // 4. Scroll Reveal Animations (using Intersection Observer)
  // Wrap elements in index.html dynamically to add reveal effect
  const revealElements = [
    '.about-text-card', '.about-stats', '.skill-category-card',
    '.project-card', '.timeline-item', '.edu-card', 
    '.achievements-section', '.certifications-section',
    '.contact-info-wrapper', '.contact-form-wrapper'
  ];

  revealElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Custom logic: trigger skill progress bar animations when visible
        if (entry.target.classList.contains('skill-category-card')) {
          const bars = entry.target.querySelectorAll('.skill-bar-fill');
          bars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
              bar.style.width = targetWidth + '%';
            }
          });
        }
        
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  // 5. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-70px 0px 0px 0px' // accounts for navbar height
  });

  sections.forEach(section => {
    scrollObserver.observe(section);
  });


  // 6. Contact Form Handler (Interactive Feedback)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Visual state: submitting
      submitBtn.disabled = true;
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `Sending... <span class="cursor">|</span>`;
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Mock API trigger (1.5s delay to simulate cloud submission)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        
        // Success response
        formStatus.classList.add('success');
        formStatus.textContent = `Thanks, ${name}! Your message was successfully sent (mocked). I will get back to you soon.`;
        
        // Reset form inputs
        contactForm.reset();
        
        // Clear message after 6 seconds
        setTimeout(() => {
          formStatus.style.transition = 'opacity 1s';
          formStatus.style.opacity = '0';
          setTimeout(() => {
            formStatus.textContent = '';
            formStatus.style.opacity = '1';
            formStatus.className = 'form-status';
          }, 1000);
        }, 6000);

      }, 1500);
    });
  }

});
