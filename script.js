document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      mobileMenu.setAttribute('aria-hidden', expanded);
      
      // Prevent body scrolling when menu is open
      if (!expanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }
  
  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
        !mobileMenu.contains(e.target) && 
        e.target !== mobileMenuButton && 
        !mobileMenuButton.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
          // Jump directly to the target
          target.scrollIntoView();
        } else {
          // Smooth scroll to the target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
      }
    });
  });
  
  // Netflix-style slider functionality
  const setupSlider = (sliderId, prevId, nextId) => {
    const slider = document.getElementById(sliderId);
    const prevButton = document.getElementById(prevId);
    const nextButton = document.getElementById(nextId);
    
    if (!slider || !prevButton || !nextButton) return;
    
    const scrollAmount = 330; // card width + gap
    
    nextButton.addEventListener('click', () => {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    prevButton.addEventListener('click', () => {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    // Show/hide arrows based on scroll position
    slider.addEventListener('scroll', () => {
      // Show prev button only if scrolled
      prevButton.style.display = slider.scrollLeft > 20 ? 'flex' : 'none';
      
      // Hide next button when reached end
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth - 20;
      nextButton.style.display = slider.scrollLeft >= maxScrollLeft ? 'none' : 'flex';
    });
    
    // Initial state - hide prev button
    prevButton.style.display = 'none';
  };
  
  // Setup sliders
  setupSlider('critical-mass-slider', 'cm-prev', 'cm-next');
  setupSlider('uw-slider', 'uw-prev', 'uw-next');
  
  // Project detail view
  document.querySelectorAll('.project-view-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const title = card.querySelector('.project-title').textContent;
      const cardContent = card.querySelector('.project-content');
      
      // Create a modal to show the project details
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4';
      modal.id = 'project-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'bg-primary-dark p-6 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto';
      
      // Clone the content and make it more detailed
      const detailedContent = cardContent.cloneNode(true);
      detailedContent.className = 'project-content-detailed';
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'absolute top-4 right-4 text-white text-2xl hover:text-accent';
      closeButton.innerHTML = '<i class="fas fa-times"></i>';
      closeButton.setAttribute('aria-label', 'Close modal');
      closeButton.onclick = () => {
        document.body.removeChild(modal);
        document.body.classList.remove('overflow-hidden');
      };
      
      // Assemble modal
      modalContent.appendChild(closeButton);
      modalContent.appendChild(detailedContent);
      modal.appendChild(modalContent);
      
      // Show modal
      document.body.appendChild(modal);
      document.body.classList.add('overflow-hidden');
      
      // Close on escape key
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(modal);
          document.body.classList.remove('overflow-hidden');
          window.removeEventListener('keydown', handleEscapeKey);
        }
      };
      
      window.addEventListener('keydown', handleEscapeKey);
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          document.body.classList.remove('overflow-hidden');
          window.removeEventListener('keydown', handleEscapeKey);
        }
      });
    });
  });
  
  // Interactive chart in hero section
  const renderHeroChart = () => {
    const ctx = document.getElementById('hero-chart');
    if (!ctx) return;
    
    // Simple data with just two bars - Professional Work and UW-Madison
    const labels = ['Professional Work', 'UW-Madison'];
    const data = [8, 4]; // Years of experience
    
    // Create horizontal bar chart with enhanced styling
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          axis: 'y', // This makes the bars horizontal
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.9)', // Professional Work - blue
            'rgba(229, 9, 20, 0.9)'   // UW-Madison - Netflix red
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(229, 9, 20)'
          ],
          borderWidth: 2,
          borderRadius: 4,
          barThickness: 50
        }]
      },
      options: {
        indexAxis: 'y', // This makes the bars horizontal
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
          }
        },
        plugins: {
          legend: {
            display: false // We're using custom legend below the chart
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.raw + ' years of experience';
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            titleFont: {
              size: 16,
              weight: 'bold',
              family: "'Inter', sans-serif"
            },
            bodyFont: {
              size: 16,
              family: "'Inter', sans-serif"
            },
            padding: 15,
            cornerRadius: 4,
            displayColors: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1
            },
            border: {
              dash: [2, 4]
            },
            ticks: {
              color: '#FFFFFF',
              font: {
                size: 14,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              padding: 10,
              callback: function(value) {
                return value + ' Years';
              }
            },
            title: {
              display: true,
              text: 'YEARS OF EXPERIENCE',
              color: '#FFFFFF',
              font: {
                size: 16,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              padding: {top: 15, bottom: 15}
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#FFFFFF',
              font: {
                size: 16,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              padding: 20
            }
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        animation: {
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  };
  
  // Initialize chart
  renderHeroChart();
  
  // Form validation
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Don't prevent default - we want the form to actually submit
      
      // Reset previous errors
      document.querySelectorAll('.form-error').forEach(el => {
        el.classList.add('hidden');
      });
      
      // Basic validation
      let isValid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const notes = document.getElementById('notes');
      
      if (!name.value.trim()) {
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
      }
      
      if (!notes.value.trim()) {
        document.getElementById('notes-error').classList.remove('hidden');
        isValid = false;
      }
      
      // If validation fails, prevent default
      if (!isValid) {
        e.preventDefault();
      } else {
        // Show the success message
        setTimeout(() => {
          contactForm.reset();
          contactForm.classList.add('hidden');
          formSuccess.classList.remove('hidden');
        }, 500);
      }
    });
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Add animation to elements when they come into view
  const animateOnScroll = () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const elements = document.querySelectorAll('.project-card, .skill-badge, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
  };
  
  // Initialize animations
  animateOnScroll();
  
  // Keyboard accessibility for interactive elements
  const addKeyboardAccess = () => {
    // Make non-button interactive elements keyboard accessible
    document.querySelectorAll('.project-card, .skill-badge').forEach(element => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
    
    // Ensure proper focus management
    document.addEventListener('keydown', (e) => {
      // Handle Escape key for closing dialogs/menus
      if (e.key === 'Escape') {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileMenuButton.focus();
        }
      }
    });
  };
  
  // Initialize keyboard accessibility
  addKeyboardAccess();
  
  // Ensure proper touch target sizes for mobile
  const ensureProperTouchTargets = () => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) {
          element.style.minHeight = '48px';
          element.style.minWidth = '48px';
          if (window.getComputedStyle(element).display === 'inline') {
            element.style.display = 'inline-block';
          }
        }
      });
    }
  };
  
  // Initialize touch target sizing
  ensureProperTouchTargets();
});
