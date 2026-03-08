// main.js - Vanilla JS for interactive components

(function() {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {

    // 1. Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.primary-nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        nav.classList.toggle('open');
      });
    }

    // 2. Instruction panel toggle on mobile
    const panelToggle = document.querySelector('.panel-toggle');
    const panelContent = document.querySelector('.panel-content');
    if (panelToggle && panelContent) {
      panelToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        panelContent.classList.toggle('open');
      });
    }

    // 3. Carousel
    const track = document.querySelector('.carousel-track');
    const prev = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    if (track && prev && next) {
      let index = 0;
      const slides = document.querySelectorAll('.carousel-slide');
      const totalSlides = slides.length;

      function updateCarousel() {
        track.style.transform = `translateX(-${index * 100}%)`;
      }

      prev.addEventListener('click', () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateCarousel();
      });

      next.addEventListener('click', () => {
        index = (index + 1) % totalSlides;
        updateCarousel();
      });

      // Auto-rotate every 5 seconds? optional, but we keep manual.
    }

    // 4. Tabs on programs page
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    if (tabs.length && panels.length) {
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // deactivate all
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          panels.forEach(p => p.hidden = true);

          // activate current
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          const panelId = tab.getAttribute('aria-controls');
          document.getElementById(panelId).hidden = false;
        });
      });
    }

    // 5. Program search filter
    const searchInput = document.getElementById('program-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.program-card');
        cards.forEach(card => {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          if (title.includes(term)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // 6. Modal for program details
    const modal = document.getElementById('program-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (modal && modalTitle && modalBody) {
      // Open modal when any "view-details" button is clicked
      document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const card = this.closest('.program-card');
          const programName = card.querySelector('h3').textContent;
          const duration = card.dataset.duration || 'N/A';
          const contact = card.dataset.contact || 'info@ump.ac.za';
          // You can also pull description from card paragraph
          const description = card.querySelector('p')?.textContent || 'No description available.';

          modalTitle.textContent = programName;
          modalBody.innerHTML = `
            <p><strong>Duration:</strong> ${duration}</p>
            <p><strong>Contact:</strong> <a href="mailto:${contact}">${contact}</a></p>
            <p>${description}</p>
            <p><a href="#" target="_blank">Official programme page (placeholder)</a></p>
          `;
          modal.hidden = false;
          modal.setAttribute('aria-hidden', 'false');
          // Focus management
          modalClose.focus();
        });
      });

      function closeModal() {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
      }

      modalClose.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', closeModal);

      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.hidden) {
          closeModal();
        }
      });
    }

    // 7. Events filter by month
    const monthFilter = document.getElementById('month-filter');
    if (monthFilter) {
      monthFilter.addEventListener('change', function() {
        const selected = this.value;
        const events = document.querySelectorAll('.event-item');
        events.forEach(event => {
          const month = event.dataset.month;
          if (selected === 'all' || month === selected) {
            event.style.display = 'block';
          } else {
            event.style.display = 'none';
          }
        });
      });
    }

    // 8. Event accordion (expand/collapse)
    document.querySelectorAll('.event-title').forEach(btn => {
      btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        const detailsId = this.getAttribute('aria-controls');
        const details = document.getElementById(detailsId);
        if (details) {
          details.hidden = !expanded;
        }
      });
    });

    // 9. Community form mailto validation
    const communityForm = document.getElementById('community-interest');
    if (communityForm) {
      communityForm.addEventListener('submit', function(e) {
        e.preventDefault(); // stop actual submit to validate
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const interest = document.getElementById('interest').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email) {
          alert('Please fill in your name and email.');
          return;
        }
        if (!validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
        }

        // Build mailto link
        const subject = encodeURIComponent('Community Interest Form');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${interest}\nMessage: ${message}`);
        window.location.href = `mailto:ict@ump.ac.za?subject=${subject}&body=${body}`;
      });

      function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      }
    }

  }); // end DOMContentLoaded
})();