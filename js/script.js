/* ==================== */
/* Portfolio JavaScript */
/* ==================== */

// ==================== DOM Elements ====================
const loader = document.getElementById('loader');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-link');
const siteHeader = document.querySelector('.site-header');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const heroCanvas = document.getElementById('hero-canvas');
const themeToggle = document.getElementById('theme-toggle');

// ==================== Theme Toggle ====================

// Initialize theme on page load
const initTheme = () => {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('theme');
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine theme: saved > system > default (dark)
  const theme = savedTheme || (prefersDark ? 'dark' : 'dark');
  
  applyTheme(theme);
};

// Apply theme
const applyTheme = (theme) => {
  const body = document.body;
  
  if (theme === 'light') {
    body.classList.remove('dark');
    body.classList.add('light');
  } else {
    body.classList.remove('light');
    body.classList.add('dark');
  }
  
  // Save preference
  localStorage.setItem('theme', theme);
};

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

// Apply theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// ==================== Loading Animation ====================
window.addEventListener('load', () => {
  // Simulate loading time
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger reveal animations
    observeElements();
  }, 1500);
});

// ==================== Navigation ====================

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu when link clicked
navItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth scrolling for navigation
navItems.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Skip external links and PDF
    if (href.startsWith('http') || href.endsWith('.pdf')) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = siteHeader.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update navigation highlighting based on scroll position
window.addEventListener('scroll', () => {
  // Update header style on scroll
  if (window.scrollY > 50) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==================== Reveal Animations ====================

// Intersection Observer for reveal animations
const observeElements = () => {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay based on element position for staggered effect
        const delay = Array.from(revealElements).indexOf(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
};

// ==================== Canvas Animation (Hero Background) ====================

const initCanvas = () => {
  const canvas = heroCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  
  // Set canvas size
  const setCanvasSize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  // Particle system
  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - distance / 100) * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
  };

  animate();
};

// Initialize canvas after page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvas);
} else {
  initCanvas();
}

// ==================== Form Handling ====================

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validation
  if (!name || !email || !message) {
    showFormStatus('Please fill in all fields', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormStatus('Please enter a valid email address', 'error');
    return;
  }

  // In a real application, you would send this to a backend
  // For now, we'll just show a success message
  try {
    // Simulate sending email
    await simulateSendEmail(name, email, message);
    
    showFormStatus(
      '✓ Message received! I\'ll get back to you soon.',
      'success'
    );
    
    contactForm.reset();
    
    // Clear status after 5 seconds
    setTimeout(() => {
      formStatus.classList.remove('success', 'error');
      formStatus.textContent = '';
    }, 5000);

  } catch (error) {
    showFormStatus('Something went wrong. Please try again.', 'error');
  }
});

// Simulate email sending
const simulateSendEmail = (name, email, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Message details:', { name, email, message });
      resolve();
    }, 800);
  });
};

// Show form status message
const showFormStatus = (message, type) => {
  formStatus.textContent = message;
  formStatus.classList.remove('success', 'error');
  formStatus.classList.add(type);
};

// ==================== Smooth Scroll Behavior ====================

// Polyfill for smooth scrolling in older browsers
const smoothScrollPolyfill = () => {
  if (!window.requestAnimationFrame) {
    return;
  }

  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const startPosition = window.scrollY;
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          };
          const run = easeInOutQuad(timeElapsed / duration);
          window.scrollTo(0, startPosition + distance * run);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        };
        
        requestAnimationFrame(animation);
      }
    });
  });
};

// Run polyfill on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
} else {
  smoothScrollPolyfill();
}

// ==================== Accessibility & Performance ====================

// Detect if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Add reveal animations only if user doesn't prefer reduced motion
  observeElements();
}

// Lazy load images (if any)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== Utility Functions ====================

// Debounce function for scroll events
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Check if element is in viewport
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// ==================== Page Performance ====================

// Prefetch critical resources
window.addEventListener('load', () => {
  // This helps improve performance for subsequent navigation
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = 'css/style.css';
  document.head.appendChild(link);
});

// Log performance metrics
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
  });
}

// ==================== Development Console Info ====================

console.log(
  '%cWelcome to Moti Abe\'s Portfolio!',
  'color: #6366f1; font-size: 16px; font-weight: bold;'
);
console.log(
  '%cBuild with HTML, CSS & JavaScript',
  'color: #818cf8; font-size: 12px;'
);
