document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');

    function updateCarousel() {
      const card = cards[0];
      if (!card) return;
      
      const gap = 32; 
      const cardWidth = card.getBoundingClientRect().width;
      const scrollDistance = cardWidth + gap;

      const maxIndex = cards.length - 1;
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      track.style.transform = `translateX(-${currentIndex * scrollDistance}px)`;
    }

    nextBtn.addEventListener('click', () => {
      const cardsVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      const maxIndex = Math.max(0, cards.length - cardsVisible);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      const cardsVisible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      const maxIndex = Math.max(0, cards.length - cardsVisible);
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex; 
      }
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
  }

  const modalOverlay = document.getElementById('demo-modal');
  const modalCloseBtn = modalOverlay?.querySelector('.modal-close');
  const demoButtons = document.querySelectorAll('[data-open-demo]');
  const planSelect = document.getElementById('modal-plan-select');

  function openModal(planName = '') {
    if (!modalOverlay) return;
    if (planSelect && planName) {
      planSelect.value = planName;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
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
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    const modalForm = modalOverlay.querySelector('.modal-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = modalForm.querySelector('.form-submit-btn');
        if (submitBtn) {
          submitBtn.textContent = 'Enviando solicitud...';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          alert('¡Gracias por su interés en EdgeWatch! Nos pondremos en contacto con su equipo a la brevedad para coordinar la demostración.');
          modalForm.reset();
          if (submitBtn) {
            submitBtn.textContent = 'Solicitar demostración';
            submitBtn.disabled = false;
          }
          closeModal();
        }, 800);
      });
    }
  }
});
