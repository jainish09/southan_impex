document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER SCROLL EFFECT & ACTIVE LINK HIGHLIGHTER ---
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id], body[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  const handleScroll = () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.parentElement.classList.add('active');
      }
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call

  // Back to Top Click
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. MOBILE NAVIGATION TOGGLE ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const spans = mobileToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- 3. PRODUCT CATEGORY FILTER TABS ---
  const productFilterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  productFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      productFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fade-in 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Dropdown Link Filter Triggers
  document.querySelectorAll('.product-filter-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetFilter = trigger.getAttribute('data-filter');
      const targetTab = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });

  // --- 4. GALLERY FILTER TABS ---
  const galleryFilterBtns = document.querySelectorAll('.g-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const gfilter = btn.getAttribute('data-gfilter');

      galleryItems.forEach(item => {
        const gcategory = item.getAttribute('data-gcategory');
        if (gfilter === 'all' || gcategory === gfilter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 5. QUOTE MODAL CONTROLLER ---
  const quoteModal = document.getElementById('quote-modal');
  const modalCloseBtn = document.querySelector('.modal-close');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const modalProductSelect = document.getElementById('modal-product-select');

  const openModal = (productName = '') => {
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (productName && modalProductSelect) {
        // Pre-select matching product option or set first closest
        const options = Array.from(modalProductSelect.options);
        const match = options.find(opt => opt.value.toLowerCase().includes(productName.toLowerCase()));
        if (match) {
          modalProductSelect.value = match.value;
        }
      }
    }
  };

  const closeModal = () => {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || '';
      openModal(product);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 6. TOAST NOTIFICATIONS SYSTEM ---
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, title = 'Success') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>⚡</span>
      <div>
        <strong>${title}</strong>
        <p style="margin:0; font-size:0.8rem; color:#cbd5e1">${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // --- 7. FORM SUBMISSIONS HANDLING ---
  const mainContactForm = document.getElementById('main-contact-form');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Our wholesale sales team will contact you within 30 minutes.', 'Message Received!');
      mainContactForm.reset();
    });
  }

  const quoteModalForm = document.getElementById('quote-modal-form');
  if (quoteModalForm) {
    quoteModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Your quote request has been sent successfully.', 'Quote Request Submitted');
      quoteModalForm.reset();
      closeModal();
    });
  }

  // --- 8. ANIMATED STATS COUNTERS ---
  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const targetText = counter.getAttribute('data-target');
      const suffix = targetText.replace(/[0-9]/g, '');
      const targetVal = parseInt(targetText.replace(/[^0-9]/g, ''), 10);

      if (isNaN(targetVal)) {
        counter.textContent = targetText;
        return;
      }

      let currentVal = 0;
      const duration = 2000;
      const steps = 50;
      const stepVal = Math.ceil(targetVal / steps);
      const intervalTime = duration / steps;

      const timer = setInterval(() => {
        currentVal += stepVal;
        if (currentVal >= targetVal) {
          currentVal = targetVal;
          clearInterval(timer);
        }

        if (targetText.includes('+')) {
          counter.textContent = currentVal + '+';
        } else {
          counter.textContent = currentVal;
        }
      }, intervalTime);
    });
  };

  if ('IntersectionObserver' in window && statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  } else {
    animateCounters();
  }

  // --- 9. UNIFIED BRANCH HUB & MAP INTERACTIVITY ---
  const hubTabs = document.querySelectorAll('.hub-tab-btn');
  const busLocationItems = document.querySelectorAll('.bus-location-item');
  const mapIframe = document.getElementById('branch-google-map');
  const hubCard = document.querySelector('.branch-hub-card');
  
  const activeBadge = document.getElementById('active-branch-badge');
  const activeTitle = document.getElementById('active-branch-title');
  const activeSubtitle = document.getElementById('active-branch-subtitle');
  const activeAddress = document.getElementById('active-branch-address');
  const activePhone = document.getElementById('active-branch-phone');
  const activeDirectLink = document.getElementById('active-map-direct-link');

  const branchDataMap = {
    'kochi-ho': {
      title: 'Southern Impex Kochi (Head Office)',
      subtitle: 'Central Master Supply Depot & Executive Head Office',
      badge: 'HEAD OFFICE',
      badgeClass: 'hq',
      address: 'Metro Pillar 420, Kalamassery, Kochi, Kerala 682033',
      phone: '+91 98470 12345 / 0484 2555777',
      embedUrl: 'https://maps.google.com/maps?q=Southern+Impex,+Kochi,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Impex+Kochi+Kerala'
    },
    'kochi-tech': {
      title: 'Southern Sign Technology (Kochi)',
      subtitle: 'Signage Hardware & Technical Support Center',
      badge: 'SIGN TECH',
      badgeClass: 'tech',
      address: 'MG Road, Ernakulam, Kochi, Kerala 682016',
      phone: '+91 98470 23456 / 0484 2366888',
      embedUrl: 'https://maps.google.com/maps?q=Southern+Sign+Technology,+Kochi,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Sign+Technology+Kochi+Kerala'
    },
    'calicut': {
      title: 'Southern Sales Corporation (Calicut)',
      subtitle: 'Malabar Regional Master Supply Depot',
      badge: 'MALABAR HUB',
      badgeClass: 'calicut',
      address: 'Mavoor Road Trade Hub, Calicut, Kerala 673004',
      phone: '+91 98470 34567 / 0495 2722999',
      embedUrl: 'https://maps.google.com/maps?q=Southern+Sales+Corporation,+Calicut,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Sales+Corporation+Calicut+Kerala'
    },
    'trivandrum': {
      title: 'Southern Impex Trivandrum',
      subtitle: 'South Kerala Regional Wholesale Depot',
      badge: 'SOUTH KERALA HUB',
      badgeClass: 'tvm',
      address: 'TC Road Industrial Zone, Trivandrum, Kerala 695001',
      phone: '+91 98470 45678 / 0471 2477111',
      embedUrl: 'https://maps.google.com/maps?q=Southern+Impex,+Trivandrum,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Impex+Trivandrum+Kerala'
    }
  };

  function updateBranchView(targetBranchId) {
    const data = branchDataMap[targetBranchId];
    if (!data) return;

    hubTabs.forEach(tab => {
      if (tab.getAttribute('data-branch') === targetBranchId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    busLocationItems.forEach(item => {
      if (item.getAttribute('data-branch') === targetBranchId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (activeBadge) {
      activeBadge.textContent = data.badge;
      activeBadge.className = `branch-badge ${data.badgeClass}`;
    }
    if (activeTitle) activeTitle.textContent = data.title;
    if (activeSubtitle) activeSubtitle.textContent = data.subtitle;
    if (activeAddress) activeAddress.textContent = data.address;
    if (activePhone) activePhone.textContent = data.phone;
    if (activeDirectLink) activeDirectLink.href = data.directUrl;

    if (mapIframe) {
      mapIframe.style.opacity = '0.2';
      setTimeout(() => {
        mapIframe.src = data.embedUrl;
        mapIframe.style.opacity = '1';
      }, 120);
    }
  }

  hubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const branchId = tab.getAttribute('data-branch');
      updateBranchView(branchId);
    });
  });

  busLocationItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const branchId = item.getAttribute('data-branch');
      updateBranchView(branchId);
    });
  });

  // Smooth IntersectionObserver for Hub Card Entrance
  if ('IntersectionObserver' in window && hubCard) {
    const hubObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    hubObserver.observe(hubCard);
  } else if (hubCard) {
    hubCard.classList.add('is-visible');
  }
});





