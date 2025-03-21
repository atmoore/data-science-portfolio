// Enhanced Category and Client Filtering Functionality
document.addEventListener('DOMContentLoaded', () => {
  const categoryFilterButtons = document.querySelectorAll('.project-filters-container:first-of-type .category-filter');
  const clientFilterButtons = document.querySelectorAll('.project-filters-container:nth-of-type(2) .category-filter');
  const projectCards = document.querySelectorAll('.project-card');
  let activeCategory = 'all'; // Default active category
  let activeClient = 'all-accounts'; // Default active client

  // IMPORTANT: Remove any existing counters to prevent duplicates
  document.querySelectorAll('.filter-counter').forEach(counter => {
    counter.remove();
  });
  
  // Filter counter for categories
  const createCategoryCounter = () => {
    const counter = document.createElement('span');
    counter.className = 'filter-counter ml-2';
    counter.textContent = projectCards.length;
    
    // Find the "All" filter button and append counter
    const allButton = document.querySelector('.project-filters-container:first-of-type .category-filter[data-category="all"]');
    if (allButton && !allButton.querySelector('.filter-counter')) {
      allButton.appendChild(counter);
    }
  };
  
  // Filter counter for clients
  const createClientCounter = () => {
    const counter = document.createElement('span');
    counter.className = 'filter-counter ml-2';
    counter.textContent = projectCards.length;
    
    // Find the "All" clients filter button and append counter
    const allButton = document.querySelector('.project-filters-container:nth-of-type(2) .category-filter[data-category="all-accounts"]');
    if (allButton && !allButton.querySelector('.filter-counter')) {
      allButton.appendChild(counter);
    }
  };
  
  // Initialize counters for each category
  const initCategoryCounts = () => {
    // First create and add counter for "All" categories
    createCategoryCounter();
    
    // Create counters for each category
    categoryFilterButtons.forEach(button => {
      if (button.dataset.category !== 'all') {
        const category = button.dataset.category;
        let count = 0;
        
        // Count projects in this category
        projectCards.forEach(card => {
          const categories = card.dataset.categories ? card.dataset.categories.split(',') : [];
          if (categories.includes(category)) {
            count++;
          }
        });
        
        // Only add counter if there are projects in this category
        if (count > 0) {
          const counter = document.createElement('span');
          counter.className = 'filter-counter';
          counter.textContent = count;
          button.appendChild(counter);
        }
      }
    });
  };
  
  // Initialize counters for each client
  const initClientCounts = () => {
    // First create and add counter for "All" clients
    createClientCounter();
    
    // Create counters for each client
    clientFilterButtons.forEach(button => {
      if (button.dataset.category !== 'all-accounts') {
        const client = button.dataset.category;
        let count = 0;
        
        // Count projects for this client
        projectCards.forEach(card => {
          const clients = card.dataset.accounts ? card.dataset.accounts.split(',') : [];
          if (clients.includes(client)) {
            count++;
          }
        });
        
        // Only add counter if there are projects for this client
        if (count > 0) {
          const counter = document.createElement('span');
          counter.className = 'filter-counter';
          counter.textContent = count;
          button.appendChild(counter);
        }
      }
    });
  };
  
  // Filter projects by both category and client
  const filterProjects = () => {
    // Show/hide projects based on category and client
    projectCards.forEach(card => {
      const cardCategories = card.dataset.categories ? card.dataset.categories.split(',') : [];
      const cardClients = card.dataset.accounts ? card.dataset.accounts.split(',') : [];
      
      const matchesCategory = activeCategory === 'all' || cardCategories.includes(activeCategory);
      const matchesClient = activeClient === 'all-accounts' || cardClients.includes(activeClient);
      
      if (matchesCategory && matchesClient) {
        // Show this project immediately
        card.classList.remove('hidden-card');
        card.style.display = '';
      } else {
        // Hide this project immediately
        card.classList.add('hidden-card');
        card.style.display = 'none';
      }
    });
    
    // Update URL hash for bookmarking WITHOUT scrolling the page
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (activeCategory === 'all' && activeClient === 'all-accounts') {
      // Clear hash if everything is set to "all"
      const url = window.location.pathname + window.location.search;
      history.replaceState(null, '', url);
    } else {
      // Create a combined hash value
      const hashValue = [];
      if (activeCategory !== 'all') hashValue.push(`category=${activeCategory}`);
      if (activeClient !== 'all-accounts') hashValue.push(`client=${activeClient}`);
      
      window.location.hash = hashValue.join('&');
      window.scrollTo(0, scrollPosition);
    }
  };
  
  // Update active buttons for categories
  const updateCategoryButtons = (category) => {
    categoryFilterButtons.forEach(btn => {
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    activeCategory = category;
  };
  
  // Update active buttons for clients
  const updateClientButtons = (client) => {
    clientFilterButtons.forEach(btn => {
      if (btn.dataset.category === client) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    activeClient = client;
  };
  
  // Add click event listeners to category filter buttons
  categoryFilterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const category = button.dataset.category;
      updateCategoryButtons(category);
      filterProjects();
    });
  });
  
  // Add click event listeners to client filter buttons
  clientFilterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const client = button.dataset.category;
      updateClientButtons(client);
      filterProjects();
    });
  });
  
  // Initialize category and client counts
  initCategoryCounts();
  initClientCounts();
  
  // Check URL hash for filters
  const checkUrlForFilters = () => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove the # character
      const params = new URLSearchParams(hash);
      
      // Check for category filter
      if (params.has('category')) {
        const category = params.get('category');
        const validCategories = Array.from(categoryFilterButtons).map(btn => btn.dataset.category);
        
        if (validCategories.includes(category)) {
          updateCategoryButtons(category);
        }
      }
      
      // Check for client filter
      if (params.has('client')) {
        const client = params.get('client');
        const validClients = Array.from(clientFilterButtons).map(btn => btn.dataset.category);
        
        if (validClients.includes(client)) {
          updateClientButtons(client);
        }
      }
      
      // Apply filters
      filterProjects();
    } else {
      // Default to show all
      updateCategoryButtons('all');
      updateClientButtons('all-accounts');
      filterProjects();
    }
  };
  
  // Initialize with proper filters
  setTimeout(checkUrlForFilters, 100);
  
  // Update when URL hash changes
  window.addEventListener('hashchange', checkUrlForFilters);
});