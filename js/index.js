document.addEventListener('DOMContentLoaded', () => {
  function getI18nDict() {
    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en_US';
    return (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : null;
  }

  const mobileToggle = document.getElementById('mobile-nav-toggle') || document.querySelector('.mobile-toggle');
  const navMenu = document.getElementById('primary-navigation') || document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    function closeMobileNav() {
      navMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      const dict = getI18nDict();
      mobileToggle.setAttribute('aria-label', dict ? dict.mobile_menu_open : 'Open navigation menu');
      mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    }

    function openMobileNav() {
      navMenu.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      const dict = getI18nDict();
      mobileToggle.setAttribute('aria-label', dict ? dict.mobile_menu_close : 'Close navigation menu');
      mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    }

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  const faqButtons = Array.from(document.querySelectorAll('.faq-question'));

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherPanel = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.setAttribute('aria-hidden', 'true');
        });

        if (!isCurrentlyExpanded) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerPanel.setAttribute('aria-hidden', 'false');
        }
      });
    }
  });

  faqButtons.forEach((btn, index) => {
    btn.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowDown') {
        targetIndex = (index + 1) % faqButtons.length;
      } else if (e.key === 'ArrowUp') {
        targetIndex = (index - 1 + faqButtons.length) % faqButtons.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = faqButtons.length - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        faqButtons[targetIndex].focus();
      }
    });
  });

  const track = document.getElementById('testimonials-track') || document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const carouselStatus = document.getElementById('carousel-status');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');

    function announceSlide() {
      if (!carouselStatus) return;
      const dict = getI18nDict();
      const template = dict?.test_slide_status || 'Showing slide {current} of {total}';
      carouselStatus.textContent = template
        .replace('{current}', currentIndex + 1)
        .replace('{total}', cards.length);
    }

    function updateCarousel(announce = true) {
      const card = cards[0];
      if (!card) return;

      const gap = 32;
      const cardWidth = card.getBoundingClientRect().width;
      const scrollDistance = cardWidth + gap;

      const maxIndex = cards.length - 1;
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      track.style.transform = `translateX(-${currentIndex * scrollDistance}px)`;
      if (announce) {
        announceSlide();
      }
    }

    nextBtn.addEventListener('click', () => {
      const cardsVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      const maxIndex = Math.max(0, cards.length - cardsVisible);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel(true);
    });

    prevBtn.addEventListener('click', () => {
      const cardsVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      const maxIndex = Math.max(0, cards.length - cardsVisible);
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateCarousel(true);
    });

    window.addEventListener('resize', () => updateCarousel(false));
  }

  // ==================== Demo & Contact Modal (WAI-ARIA Dialog Pattern) ====================
  const modalOverlay = document.getElementById('demo-modal');
  const modalCloseBtn = modalOverlay?.querySelector('.modal-close');
  const demoButtons = document.querySelectorAll('[data-open-demo]');
  const planSelect = document.getElementById('modal-plan-select');
  const modalStatus = document.getElementById('modal-status');
  let lastFocusedElement = null;

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function openModal(planName = '') {
    if (!modalOverlay) return;
    lastFocusedElement = document.activeElement;

    if (planSelect && planName) {
      planSelect.value = planName;
    }
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstInput = modalOverlay.querySelector('#modal-name') || modalCloseBtn;
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  demoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = button.getAttribute('data-plan') || '';
      openModal(plan);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modalOverlay.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements(modalOverlay);
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    const modalForm = modalOverlay.querySelector('.modal-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dict = getI18nDict();

        const submitBtn = modalForm.querySelector('.form-submit-btn');
        if (submitBtn) {
          submitBtn.textContent = dict ? dict.modal_submitting : 'Sending request...';
          submitBtn.disabled = true;
        }

        if (modalStatus) {
          modalStatus.textContent = dict ? dict.modal_submitting : 'Sending request...';
        }

        setTimeout(() => {
          const successMsg = dict ? dict.modal_success : 'Thank you for your interest in EdgeWatch! Our team will get in touch shortly to coordinate your demonstration.';

          if (modalStatus) {
            modalStatus.textContent = successMsg;
          }

          alert(successMsg);
          modalForm.reset();
          if (submitBtn) {
            submitBtn.textContent = dict ? dict.modal_submit : 'Request demonstration';
            submitBtn.disabled = false;
          }
          closeModal();
        }, 800);
      });
    }
  }
});
