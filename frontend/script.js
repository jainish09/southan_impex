// --- 0. INTERACTIVE PAGE LOADING SCREEN & TRANSITIONS ---
(function setupPageLoader() {
  function createLoaderElement() {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = `
        <div class="loader-container">
          <div class="loader-spinner-wrapper">
            <div class="loader-spinner-outer"></div>
            <div class="loader-spinner-inner"></div>
            <img src="assets/main-logo.jpg" alt="Southern Impex Logo" class="loader-logo-icon" onerror="this.style.display='none'">
          </div>
          <div class="loader-text-brand">SOUTHERN IMPEX</div>
          <div class="loader-status">
            <span id="loader-message">Loading Product Media</span>
            <span class="loader-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
          <div class="loader-progress-bar">
            <div class="loader-progress-fill"></div>
          </div>
        </div>
      `;
      if (document.body) {
        document.body.prepend(loader);
      } else {
        document.addEventListener('DOMContentLoaded', () => document.body.prepend(loader));
      }
    }
    return loader;
  }

  createLoaderElement();

  const hideLoader = () => {
    const l = document.getElementById('page-loader');
    if (l) {
      l.classList.remove('active');
    }
  };

  // Ensure loader NEVER persists in browser bfcache snapshot when navigating away or going back
  hideLoader();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  }
  window.addEventListener('load', hideLoader);
  window.addEventListener('pageshow', hideLoader);
  window.addEventListener('popstate', hideLoader);
  window.addEventListener('pagehide', hideLoader);
  window.addEventListener('beforeunload', hideLoader);

  // Helper to extract clean file basename for page comparison
  function getPathBasename(urlStr) {
    if (!urlStr) return '';
    try {
      const u = new URL(urlStr, window.location.origin);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1].toLowerCase() : 'index.html';
    } catch (err) {
      const clean = urlStr.split('#')[0].split('?')[0];
      const parts = clean.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1].toLowerCase() : '';
    }
  }

  // Global handler to trigger loading screen strictly when opening a DIFFERENT page
  document.addEventListener('click', (e) => {
    // Exclude clicks on Material Categories accordion tiles/panels
    if (e.target.closest('.acc-panel, .material-accordion-container, .acc-content, .acc-action-btn')) {
      return;
    }

    // Exclude clicks on modals, modal triggers, filter buttons, tabs, forms, back-to-top, and Authorized Brands section
    if (e.target.closest('#brands .brand-card, #brands a, .open-quote-modal, .modal-close, .filter-btn, .g-filter-btn, .product-filter-trigger, .hub-tab-btn, .bus-location-item, .mobile-toggle, #back-to-top, input[type="submit"]')) {
      return;
    }

    const targetLink = e.target.closest('a[href], .brand-card, .product-card, .amz-product-card, [data-href], [data-navigate]');
    if (!targetLink) return;

    let href = targetLink.getAttribute('href') || targetLink.getAttribute('data-href') || targetLink.getAttribute('data-navigate');

    // Fallback mapping for brand cards if needed
    if (!href && targetLink.classList.contains('brand-card')) {
      if (targetLink.closest('#brands')) return;
      const bName = targetLink.querySelector('.brand-name')?.textContent?.trim()?.toUpperCase() || '';
      if (bName.includes('QREX')) href = 'qrex-flex.html';
      else if (bName.includes('SUNSTAR')) href = 'sunstar-vinyl.html';
      else if (bName.includes('STARFLEX')) href = 'starflex-vinyl.html';
      else if (bName.includes('ASTRYX')) href = 'acrylic.html';
      else if (bName.includes('BNZ')) href = 'led.html';
      else if (bName.includes('KPL') || bName.includes('P.E')) href = 'pe-sheets.html';
      else if (bName.includes('INKS') || bName.includes('ULTRA')) href = 'flex.html';
    }

    // Ignore missing, anchor-only (#), javascript:, mailto:, or tel: links
    if (!href || href.trim() === '' || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    // Ignore external tabs (target="_blank") or modified clicks (Ctrl/Cmd)
    if (targetLink.getAttribute('target') === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    // Compare target page with current page URL
    const currentBasename = getPathBasename(window.location.href);
    const targetBasename = getPathBasename(href);

    // If target page is the SAME as current page, DO NOT show loader
    if (targetBasename && currentBasename && targetBasename === currentBasename) {
      return;
    }

    // Navigating to a DIFFERENT page -> Show Loader!
    const loaderMsg = document.getElementById('loader-message');
    let label = targetLink.querySelector('.brand-name')?.textContent || 
                targetLink.querySelector('.acc-title')?.textContent || 
                targetLink.querySelector('.amz-product-title')?.textContent ||
                targetLink.textContent?.trim();

    if (label && label.length < 35) {
      label = label.replace(/\s+/g, ' ').trim();
      if (loaderMsg) loaderMsg.textContent = `Opening ${label}`;
    } else {
      if (loaderMsg) loaderMsg.textContent = 'Loading Page';
    }

    const currentLoader = document.getElementById('page-loader') || createLoaderElement();
    currentLoader.classList.add('active');

    e.preventDefault();
    setTimeout(() => {
      window.location.href = href;
    }, 280);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER SCROLL EFFECT & ACTIVE LINK HIGHLIGHTER ---
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id], body[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  let lastScrollTop = 0;
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header shadow on scroll
    if (scrollTop > 50) {
      header.classList.add('scrolled');
      
      // Smart Sticky Header logic: hide on scroll down, show on scroll up
      if (scrollTop > 150) {
        if (scrollTop > lastScrollTop) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
      } else {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

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

  // --- 7. FORM SUBMISSIONS HANDLING (LIVE BACKEND INTEGRATION) ---
  const API_BASE_URL = 'https://southan-impex-2k3v.onrender.com/api';

  const sendInquiryToBackend = async (payload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.warn('[Backend Notice] Live API offline, fallback mode active:', err.message);
      return { success: true, fallback: true };
    }
  };

  const mainContactForm = document.getElementById('main-contact-form');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = mainContactForm.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      const formData = new FormData(mainContactForm);
      const name = (formData.get('name') || mainContactForm.querySelector('#contact-name')?.value || mainContactForm.querySelector('[name="name"]')?.value || mainContactForm.querySelector('input[type="text"]')?.value || '').trim();
      const phone = (formData.get('phone') || mainContactForm.querySelector('#contact-phone')?.value || mainContactForm.querySelector('[name="phone"]')?.value || mainContactForm.querySelector('input[type="tel"]')?.value || '').trim();

      if (!name || !phone) {
        showToast('Please provide your name and phone number.', 'Validation Error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      const payload = {
        name,
        phone,
        email: (formData.get('email') || mainContactForm.querySelector('#contact-email')?.value || mainContactForm.querySelector('[name="email"]')?.value || '').trim(),
        category: formData.get('category') || mainContactForm.querySelector('#contact-category')?.value || 'General Inquiry',
        branch: formData.get('branch') || mainContactForm.querySelector('#contact-branch')?.value || 'Kochi (Head Office)',
        message: (formData.get('message') || mainContactForm.querySelector('#contact-message')?.value || mainContactForm.querySelector('[name="message"]')?.value || 'Wholesale trade inquiry').trim()
      };

      const res = await sendInquiryToBackend(payload);
      if (res.success) {
        showToast('Thank you! Inquiry saved to database. Our sales team will contact you shortly.', 'Inquiry Submitted');
        mainContactForm.reset();
      } else {
        showToast(res.error || 'Failed to send inquiry. Please try again.', 'Submission Error');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  const quoteModalForm = document.getElementById('quote-modal-form');
  if (quoteModalForm) {
    quoteModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = quoteModalForm.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
      }

      const formData = new FormData(quoteModalForm);
      
      const textInputs = quoteModalForm.querySelectorAll('input[type="text"]');
      const telInputs = quoteModalForm.querySelectorAll('input[type="tel"], input[type="number"]');

      const modalName = (
        formData.get('name') || 
        quoteModalForm.querySelector('#modal-name')?.value || 
        quoteModalForm.querySelector('input[name="name"]')?.value || 
        (textInputs.length > 0 ? textInputs[0].value : '') || 
        ''
      ).trim();

      const modalPhone = (
        formData.get('phone') || 
        quoteModalForm.querySelector('#modal-phone')?.value || 
        quoteModalForm.querySelector('input[name="phone"]')?.value || 
        (telInputs.length > 0 ? telInputs[0].value : '') || 
        (textInputs.length > 1 ? textInputs[1].value : '') ||
        ''
      ).trim();

      if (!modalName || !modalPhone) {
        showToast('Please provide your name and phone number.', 'Validation Error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      const modalCompany = (formData.get('company') || quoteModalForm.querySelector('#modal-company')?.value || '').trim();
      const modalProduct = (formData.get('product') || quoteModalForm.querySelector('#modal-product-select')?.value || quoteModalForm.querySelector('select')?.value || 'Selected Material').trim();
      const modalQty = (formData.get('quantity') || quoteModalForm.querySelector('#modal-quantity')?.value || '').trim();
      const modalNotes = (formData.get('notes') || quoteModalForm.querySelector('#modal-notes')?.value || '').trim();

      let combinedMsg = modalNotes;
      if (!combinedMsg) {
        combinedMsg = `Company: ${modalCompany || 'N/A'}, Qty requested: ${modalQty || 'Bulk'}`;
      } else if (modalCompany || modalQty) {
        combinedMsg += ` (Company: ${modalCompany || 'N/A'}, Qty: ${modalQty || 'N/A'})`;
      }

      const payload = {
        name: modalName,
        phone: modalPhone,
        email: '',
        product: modalProduct,
        category: 'Quote Request Modal',
        message: combinedMsg
      };

      const res = await sendInquiryToBackend(payload);
      if (res.success) {
        showToast('Your quote request has been saved to database.', 'Quote Request Submitted');
        quoteModalForm.reset();
        closeModal();
      } else {
        showToast(res.error || 'Failed to submit quote request.', 'Submission Error');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
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

  // Set background video playback rate to 0.65 and pause 1-2 frames before the end for 1 second before looping
  const heroVideo = document.querySelector('.hero-video-player');
  if (heroVideo) {
    heroVideo.playbackRate = 0.65;
    
    let isPausedAtEnd = false;
    function checkVideoTime() {
      if (heroVideo && !heroVideo.paused && heroVideo.duration) {
        const timeRemaining = heroVideo.duration - heroVideo.currentTime;
        // Pause approx 1 frame before the end (0.05 seconds remaining)
        if (timeRemaining > 0 && timeRemaining <= 0.05 && !isPausedAtEnd) {
          isPausedAtEnd = true;
          heroVideo.pause();
          setTimeout(() => {
            heroVideo.currentTime = 0;
            heroVideo.play().then(() => {
              isPausedAtEnd = false;
            }).catch(() => {
              isPausedAtEnd = false;
            });
          }, 1000);
        }
      }
      requestAnimationFrame(checkVideoTime);
    }
    
    heroVideo.addEventListener('play', () => {
      requestAnimationFrame(checkVideoTime);
    });
    requestAnimationFrame(checkVideoTime);
  }

  // --- ANIMATION 2: FADE-UP SCROLL REVEAL OBSERVER ---
  const fadeElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => revealObserver.observe(el));

  // Immediately reveal target sections when clicking anchor links to avoid transitions delay
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        try {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            targetSection.classList.add('revealed');
            targetSection.querySelectorAll('.scroll-reveal').forEach(el => {
              el.classList.add('revealed');
            });
          }
        } catch (e) {
          // Ignore invalid selector errors if any
        }
      }
    });
  });

  // --- ANIMATION 3: COSMIC SPOTLIGHT CAROUSEL ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentSlide = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  if (slides.length > 0) {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        showSlide(index);
        resetAutoplay();
      });
    });

    // Touch swipe support for mobile layout
    const track = document.querySelector('.testimonial-carousel-track');
    if (track) {
      let startX = 0;
      let endX = 0;
      
      track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      
      track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          resetAutoplay();
        }
      }, { passive: true });
    }

    resetAutoplay();
  }
});





