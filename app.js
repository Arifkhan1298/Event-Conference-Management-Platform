// ============================================================================
// EVENTORA — CORE APPLICATION CONTROLLER & LOGIC ENGINE
// Fully client-side, zero build tools or servers needed.
// ============================================================================

(function () {
  "use strict";

  // --- APPLICATION STATE ---
  const state = {
    events: [...EVENTORA_DATA.events],
    speakers: [...EVENTORA_DATA.speakers],
    scheduleDays: [...EVENTORA_DATA.scheduleDays],
    networking: [...EVENTORA_DATA.networkingAttendees],
    myTickets: [...EVENTORA_DATA.myTickets],
    notifications: [...EVENTORA_DATA.notifications],
    bookmarks: new Set(JSON.parse(localStorage.getItem("eventora_bookmarks") || '["evt-1", "evt-3"]')),
    mySchedule: new Set(JSON.parse(localStorage.getItem("eventora_schedule") || '["sess-102", "sess-105"]')),
    
    // Filters & Navigation
    activeView: "public", // "public" | "organizer-dash" | "attendee-dash"
    filterCategory: "all",
    filterFormat: "all",
    filterSearch: "",
    filterSort: "popularity",
    
    // Schedules & Speakers
    activeScheduleDay: "day-1",
    activeSpeakerCategory: "All",
    
    // Featured Carousel
    carouselIndex: 0,
    carouselTimer: null,
    
    // Booking flow
    bookingEvent: null,
    bookingStep: 1,
    selectedTier: null,
    promoCode: "",
    promoDiscount: 0,
    attendeeData: {
      fullName: "",
      email: "",
      company: "",
      jobTitle: ""
    }
  };

  // --- DOM ELEMENT REFERENCES ---
  const dom = {
    // Views
    publicView: document.getElementById("public-view"),
    organizerView: document.getElementById("organizer-view"),
    attendeeView: document.getElementById("attendee-view"),
    
    // Nav
    navbar: document.getElementById("main-navbar"),
    navSearchBtn: document.getElementById("nav-search-btn"),
    navNotifBtn: document.getElementById("nav-notif-btn"),
    notifDropdown: document.getElementById("notif-dropdown"),
    notifBadge: document.getElementById("notif-badge-count"),
    notifList: document.getElementById("notif-items-list"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileMenuDrawer: document.getElementById("mobile-menu-drawer"),
    
    // Discovery
    eventsGrid: document.getElementById("events-grid"),
    searchInput: document.getElementById("event-search-input"),
    formatSelect: document.getElementById("format-select"),
    sortSelect: document.getElementById("sort-select"),
    categoryPillsContainer: document.getElementById("category-pills-container"),
    eventsCountDisplay: document.getElementById("events-count-display"),
    
    // Carousel
    carouselTrack: document.getElementById("carousel-track"),
    carouselDots: document.getElementById("carousel-dots"),
    carouselPrevBtn: document.getElementById("carousel-prev"),
    carouselNextBtn: document.getElementById("carousel-next"),
    
    // Schedule
    scheduleTabsContainer: document.getElementById("schedule-tabs-container"),
    scheduleTimelineContainer: document.getElementById("schedule-timeline-container"),
    
    // Speakers
    speakersContainer: document.getElementById("speakers-container"),
    speakersTabsContainer: document.getElementById("speakers-tabs-container"),
    
    // Networking
    networkingContainer: document.getElementById("networking-container"),
    
    // Modals
    eventDetailsModal: document.getElementById("event-details-modal"),
    eventDetailsContent: document.getElementById("event-details-content"),
    bookingModal: document.getElementById("booking-modal"),
    bookingModalBody: document.getElementById("booking-modal-body"),
    authModal: document.getElementById("auth-modal"),
    createEventModal: document.getElementById("create-event-modal"),
    globalSearchModal: document.getElementById("global-search-modal"),
    ticketPreviewModal: document.getElementById("ticket-preview-modal"),
    
    // Toast
    toastContainer: document.getElementById("toast-container"),
    
    // Quick presenter bar
    modePills: document.querySelectorAll(".mode-pill")
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    setupScrollNavbar();
    renderCategoryPills();
    renderEvents();
    initCarousel();
    renderSchedule();
    renderSpeakers();
    renderNetworking();
    renderNotifications();
    setupEventListeners();
    setupCanvasCharts();
    renderOrganizerAttendeesTable();
    renderAttendeeDashboardTickets();
    setupAnimatedCounters();
  }

  // ==========================================================================
  // VIEW SWITCHING (Public / Organizer / Attendee)
  // ==========================================================================
  function switchView(viewName) {
    state.activeView = viewName;
    
    // Update active tab buttons in presenter bar
    dom.modePills.forEach(pill => {
      if (pill.dataset.view === viewName) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    if (viewName === "public") {
      dom.publicView.style.display = "block";
      dom.organizerView.style.display = "none";
      dom.attendeeView.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (viewName === "organizer-dash") {
      dom.publicView.style.display = "none";
      dom.organizerView.style.display = "block";
      dom.attendeeView.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(setupCanvasCharts, 50);
    } else if (viewName === "attendee-dash") {
      dom.publicView.style.display = "none";
      dom.organizerView.style.display = "none";
      dom.attendeeView.style.display = "block";
      renderAttendeeDashboardTickets();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ==========================================================================
  // NAVBAR & SCROLL BEHAVIOR
  // ==========================================================================
  function setupScrollNavbar() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        dom.navbar.classList.add("scrolled");
      } else {
        dom.navbar.classList.remove("scrolled");
      }
    });
  }

  // ==========================================================================
  // DISCOVERY & FILTER ENGINE
  // ==========================================================================
  function renderCategoryPills() {
    if (!dom.categoryPillsContainer) return;
    dom.categoryPillsContainer.innerHTML = EVENTORA_DATA.categories.map(cat => `
      <button class="cat-pill ${cat.id === state.filterCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.name}</span>
      </button>
    `).join("");

    dom.categoryPillsContainer.querySelectorAll(".cat-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        state.filterCategory = btn.dataset.category;
        renderCategoryPills();
        renderEvents();
      });
    });
  }

  function getFilteredEvents() {
    return state.events.filter(evt => {
      // Category match
      const matchCat = state.filterCategory === "all" || evt.category === state.filterCategory;
      // Format match
      const matchFormat = state.filterFormat === "all" || evt.format.toLowerCase() === state.filterFormat.toLowerCase();
      // Search match
      const q = state.filterSearch.toLowerCase().trim();
      const matchSearch = !q || (
        evt.title.toLowerCase().includes(q) ||
        evt.tagline.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q) ||
        evt.organizer.name.toLowerCase().includes(q)
      );
      return matchCat && matchFormat && matchSearch;
    }).sort((a, b) => {
      if (state.filterSort === "price-low") return a.price - b.price;
      if (state.filterSort === "price-high") return b.price - a.price;
      if (state.filterSort === "date") return new Date(a.startDate) - new Date(b.startDate);
      return b.attendeeCount - a.attendeeCount; // default popularity
    });
  }

  function renderEvents() {
    if (!dom.eventsGrid) return;
    const filtered = getFilteredEvents();
    
    if (dom.eventsCountDisplay) {
      dom.eventsCountDisplay.textContent = `Showing ${filtered.length} international events`;
    }

    if (filtered.length === 0) {
      dom.eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
          <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">No events match your criteria</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0 auto 1.5rem;">Try adjusting your category filter, search keywords, or event format options.</p>
          <button class="btn btn-secondary" id="reset-filters-btn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.filterCategory = "all";
          state.filterFormat = "all";
          state.filterSearch = "";
          dom.searchInput.value = "";
          dom.formatSelect.value = "all";
          renderCategoryPills();
          renderEvents();
        });
      }
      return;
    }

    dom.eventsGrid.innerHTML = filtered.map(evt => {
      const isBookmarked = state.bookmarks.has(evt.id);
      return `
        <article class="event-card" data-id="${evt.id}">
          <div class="card-img-wrap">
            <img src="${evt.image}" alt="${evt.title}" loading="lazy" />
            <div class="card-img-overlay"></div>
            <div class="card-top-badges">
              <span class="badge ${evt.format === 'Online' ? 'badge-cyan' : evt.format === 'Hybrid' ? 'badge-purple' : 'badge-blue'}">
                ${evt.format}
              </span>
              <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" data-event-id="${evt.id}" title="Save to bookmarks" aria-label="Save bookmark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="card-date-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${evt.date}</span>
              <span style="opacity: 0.4">•</span>
              <span>${evt.attendeeCount.toLocaleString()} attendees</span>
            </div>
            <h3 class="card-title">${evt.title}</h3>
            <p class="card-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${evt.location}</span>
            </p>
            <div class="card-organizer-row">
              <div class="organizer-info">
                <img src="${evt.organizer.avatar}" alt="${evt.organizer.name}" class="organizer-avatar" />
                <span class="organizer-name">${evt.organizer.name}</span>
                ${evt.organizer.verified ? `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 12 15 16 10" stroke="#ffffff"></polyline>
                  </svg>
                ` : ''}
              </div>
            </div>
            <div class="card-footer-cta">
              <div class="card-price">
                ${evt.price === 0 ? 'Free' : `${evt.currency}${evt.price}`}
                <span>/ pass</span>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm btn-view-event" data-event-id="${evt.id}">Details</button>
                <button class="btn btn-primary btn-sm btn-book-event" data-event-id="${evt.id}">Book Now</button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Attach card event listeners
    dom.eventsGrid.querySelectorAll(".btn-bookmark").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleBookmark(btn.dataset.eventId);
      });
    });

    dom.eventsGrid.querySelectorAll(".btn-view-event").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEventDetails(btn.dataset.eventId);
      });
    });

    dom.eventsGrid.querySelectorAll(".btn-book-event").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openBookingModal(btn.dataset.eventId);
      });
    });
  }

  function toggleBookmark(eventId) {
    if (state.bookmarks.has(eventId)) {
      state.bookmarks.delete(eventId);
      showToast("Removed from your saved events", "info");
    } else {
      state.bookmarks.add(eventId);
      showToast("Added to your saved events!", "success");
    }
    localStorage.setItem("eventora_bookmarks", JSON.stringify([...state.bookmarks]));
    renderEvents();
  }

  // ==========================================================================
  // FEATURED CAROUSEL CONTROLLER
  // ==========================================================================
  function initCarousel() {
    if (!dom.carouselTrack) return;
    const featuredEvents = state.events.filter(e => e.featured);
    
    dom.carouselTrack.innerHTML = featuredEvents.map(evt => `
      <div class="featured-slide">
        <div class="featured-img-wrap">
          <img src="${evt.image}" alt="${evt.title}" />
          <div class="card-img-overlay"></div>
          <div style="position: absolute; top: 1.5rem; left: 1.5rem;">
            <span class="badge badge-purple" style="font-size: 0.813rem;">Featured Global Conference</span>
          </div>
        </div>
        <div class="featured-content">
          <div style="display: flex; align-items: center; gap: 0.75rem; color: #60a5fa; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.85rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${evt.date}</span>
            <span>•</span>
            <span>${evt.city}</span>
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; line-height: 1.25; margin-bottom: 1rem;">
            ${evt.title}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.8rem;">
            ${evt.tagline}
          </p>
          <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase;">Passes From</div>
              <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800;">${evt.currency}${evt.price}</div>
            </div>
            <div style="height: 36px; width: 1px; background: rgba(255, 255, 255, 0.1);"></div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase;">Registered</div>
              <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #34d399;">
                ${evt.attendeeCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="btn btn-primary btn-carousel-book" data-event-id="${evt.id}">
              Get Ticket Pass
            </button>
            <button class="btn btn-secondary btn-carousel-view" data-event-id="${evt.id}">
              View Agenda & Lineup
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // Render Dots
    if (dom.carouselDots) {
      dom.carouselDots.innerHTML = featuredEvents.map((_, i) => `
        <div class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
      `).join("");
      
      dom.carouselDots.querySelectorAll(".carousel-dot").forEach(dot => {
        dot.addEventListener("click", () => {
          goToCarouselSlide(parseInt(dot.dataset.index, 10));
        });
      });
    }

    // Attach click events
    dom.carouselTrack.querySelectorAll(".btn-carousel-book").forEach(btn => {
      btn.addEventListener("click", () => openBookingModal(btn.dataset.eventId));
    });
    dom.carouselTrack.querySelectorAll(".btn-carousel-view").forEach(btn => {
      btn.addEventListener("click", () => openEventDetails(btn.dataset.eventId));
    });

    if (dom.carouselPrevBtn) {
      dom.carouselPrevBtn.addEventListener("click", () => {
        const count = featuredEvents.length;
        goToCarouselSlide((state.carouselIndex - 1 + count) % count);
      });
    }
    if (dom.carouselNextBtn) {
      dom.carouselNextBtn.addEventListener("click", () => {
        const count = featuredEvents.length;
        goToCarouselSlide((state.carouselIndex + 1) % count);
      });
    }

    startCarouselAutoPlay(featuredEvents.length);
  }

  function goToCarouselSlide(index) {
    state.carouselIndex = index;
    if (dom.carouselTrack) {
      dom.carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    }
    if (dom.carouselDots) {
      dom.carouselDots.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }
  }

  function startCarouselAutoPlay(count) {
    if (state.carouselTimer) clearInterval(state.carouselTimer);
    state.carouselTimer = setInterval(() => {
      goToCarouselSlide((state.carouselIndex + 1) % count);
    }, 6500);
  }

  // ==========================================================================
  // CONFERENCE SCHEDULE TIMELINE
  // ==========================================================================
  function renderSchedule() {
    if (!dom.scheduleTabsContainer || !dom.scheduleTimelineContainer) return;
    
    // Render Day Tabs
    dom.scheduleTabsContainer.innerHTML = state.scheduleDays.map(day => `
      <div class="schedule-day-tab ${day.dayId === state.activeScheduleDay ? 'active' : ''}" data-day-id="${day.dayId}">
        <div class="tab-day-title">${day.dayTitle}</div>
        <div class="tab-day-date">${day.dateFormatted}</div>
      </div>
    `).join("");

    dom.scheduleTabsContainer.querySelectorAll(".schedule-day-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        state.activeScheduleDay = tab.dataset.dayId;
        renderSchedule();
      });
    });

    // Find current day sessions
    const activeDayObj = state.scheduleDays.find(d => d.dayId === state.activeScheduleDay) || state.scheduleDays[0];
    
    dom.scheduleTimelineContainer.innerHTML = activeDayObj.sessions.map(sess => {
      const isSaved = state.mySchedule.has(sess.id);
      const typeBadgeClass = sess.type === "Keynote" ? "badge-purple" :
                             sess.type === "Workshop" ? "badge-blue" :
                             sess.type === "Panel" ? "badge-cyan" :
                             sess.type === "Product Demo" ? "badge-amber" : "badge-emerald";
      return `
        <div class="timeline-item">
          <div class="timeline-time-col">
            <div>${sess.time}</div>
            <div style="font-size: 0.75rem; color: var(--text-faint); margin-top: 0.25rem;">${sess.room}</div>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
              <span class="badge ${typeBadgeClass}">${sess.type}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${sess.stage}</span>
            </div>
            <h4 class="session-title">${sess.title}</h4>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">${sess.description}</p>
            <div class="session-speaker">
              <span style="font-weight: 600; color: #ffffff;">${sess.speaker}</span>
              <span style="opacity: 0.6;"> • ${sess.company}</span>
            </div>
          </div>
          <div>
            <button class="btn-schedule-toggle ${isSaved ? 'saved' : ''}" data-session-id="${sess.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${isSaved ? 'Added' : 'Add to Schedule'}</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Attach bookmark toggle listeners
    dom.scheduleTimelineContainer.querySelectorAll(".btn-schedule-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const sessId = btn.dataset.sessionId;
        if (state.mySchedule.has(sessId)) {
          state.mySchedule.delete(sessId);
          showToast("Session removed from personal schedule", "info");
        } else {
          state.mySchedule.add(sessId);
          showToast("Session added to your personal schedule!", "success");
        }
        localStorage.setItem("eventora_schedule", JSON.stringify([...state.mySchedule]));
        renderSchedule();
      });
    });
  }

  // ==========================================================================
  // SPEAKERS DIRECTORY
  // ==========================================================================
  function renderSpeakers() {
    if (!dom.speakersContainer) return;
    
    const categories = ["All", "Keynote Speakers", "Industry Leaders", "Technology Experts", "Researchers", "Entrepreneurs"];
    
    if (dom.speakersTabsContainer) {
      dom.speakersTabsContainer.innerHTML = categories.map(cat => `
        <button class="speaker-tab-btn ${state.activeSpeakerCategory === cat ? 'active' : ''}" data-cat="${cat}">
          ${cat}
        </button>
      `).join("");

      dom.speakersTabsContainer.querySelectorAll(".speaker-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          state.activeSpeakerCategory = btn.dataset.cat;
          renderSpeakers();
        });
      });
    }

    const filtered = state.speakers.filter(s => {
      return state.activeSpeakerCategory === "All" || s.category === state.activeSpeakerCategory;
    });

    dom.speakersContainer.innerHTML = filtered.map(spk => `
      <div class="speaker-card">
        <div class="speaker-photo-wrap">
          <img src="${spk.avatar}" alt="${spk.name}" class="speaker-photo" loading="lazy" />
        </div>
        <h4 class="speaker-name">${spk.name}</h4>
        <div class="speaker-role">${spk.title}</div>
        <div class="speaker-company">${spk.company}</div>
        <div class="speaker-tags">
          ${spk.expertise.map(tag => `<span class="tag-pill">${tag}</span>`).join("")}
        </div>
        <p style="font-size: 0.813rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.2rem;">
          ${spk.bio}
        </p>
        <button class="btn btn-outline btn-sm btn-speaker-profile" data-speaker-id="${spk.id}" style="width: 100%;">
          View Keynotes & Sessions
        </button>
      </div>
    `).join("");

    dom.speakersContainer.querySelectorAll(".btn-speaker-profile").forEach(btn => {
      btn.addEventListener("click", () => {
        const spk = state.speakers.find(s => s.id === btn.dataset.speakerId);
        if (spk) {
          showToast(`Opening speaker dossier: ${spk.name}`, "info");
        }
      });
    });
  }

  // ==========================================================================
  // NETWORKING & ATTENDEE MATCHMAKING
  // ==========================================================================
  function renderNetworking() {
    if (!dom.networkingContainer) return;
    
    dom.networkingContainer.innerHTML = state.networking.map(person => `
      <div class="net-card">
        <div class="net-header">
          <img src="${person.avatar}" alt="${person.name}" class="net-avatar" />
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.15rem;">${person.name}</h4>
            <div style="font-size: 0.813rem; color: #a5b4fc;">${person.role}</div>
            <div style="font-size: 0.75rem; color: var(--text-faint);">${person.company} • ${person.location}</div>
          </div>
          <div class="net-score-badge">${person.matchScore}% Match</div>
        </div>
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 0.75rem; color: var(--text-faint); margin-bottom: 0.4rem; text-transform: uppercase;">Mutual Interests</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${person.mutualInterests.map(interest => `
              <span class="tag-pill" style="border: 1px solid rgba(6, 182, 212, 0.2); color: #67e8f9;">${interest}</span>
            `).join("")}
          </div>
        </div>
        <div style="margin-top: auto; display: flex; gap: 0.6rem;">
          <button class="btn ${person.connected ? 'btn-secondary' : 'btn-primary'} btn-sm btn-net-connect" data-person-id="${person.id}" style="flex: 1;">
            ${person.connected ? 'Connected' : 'Send Invite'}
          </button>
          <button class="btn btn-outline btn-sm btn-net-msg" data-person-id="${person.id}">
            Message
          </button>
        </div>
      </div>
    `).join("");

    dom.networkingContainer.querySelectorAll(".btn-net-connect").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.personId;
        const target = state.networking.find(p => p.id === id);
        if (target) {
          target.connected = !target.connected;
          if (target.connected) {
            showToast(`Connection invitation sent to ${target.name}!`, "success");
          } else {
            showToast(`Disconnected from ${target.name}`, "info");
          }
          renderNetworking();
        }
      });
    });

    dom.networkingContainer.querySelectorAll(".btn-net-msg").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.personId;
        const target = state.networking.find(p => p.id === id);
        if (target) {
          showToast(`Direct message channel opened with ${target.name}`, "info");
        }
      });
    });
  }

  // ==========================================================================
  // EVENT DETAILS MODAL & COUNTDOWN TIMER
  // ==========================================================================
  let countdownInterval = null;

  function openEventDetails(eventId) {
    const evt = state.events.find(e => e.id === eventId);
    if (!evt) return;

    if (countdownInterval) clearInterval(countdownInterval);

    dom.eventDetailsContent.innerHTML = `
      <div style="position: relative; height: 320px; overflow: hidden; border-top-left-radius: var(--radius-xl); border-top-right-radius: var(--radius-xl);">
        <img src="${evt.image}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(12, 18, 34, 0.95) 100%);"></div>
        <div style="position: absolute; bottom: 2rem; left: 2.5rem; right: 2.5rem;">
          <span class="badge badge-purple" style="margin-bottom: 0.75rem;">${evt.category.toUpperCase()} • ${evt.format}</span>
          <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.5rem;">
            ${evt.title}
          </h2>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #a5b4fc;">
            <span>📍 ${evt.location}</span>
            <span>📅 ${evt.date}</span>
          </div>
        </div>
      </div>

      <div style="padding: 2.5rem;">
        <!-- Countdown Timer -->
        <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: #a5b4fc; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Summit Commencement In</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">Doors open 08:00 AM PST sharp</div>
          </div>
          <div style="display: flex; gap: 1rem;" id="modal-countdown-timer">
            <div style="text-align: center;"><div class="count-num" style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #ffffff;" id="cd-days">38</div><div style="font-size: 0.65rem; color: var(--text-faint); text-transform: uppercase;">Days</div></div>
            <div style="font-size: 1.4rem; opacity: 0.4;">:</div>
            <div style="text-align: center;"><div class="count-num" style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #ffffff;" id="cd-hours">14</div><div style="font-size: 0.65rem; color: var(--text-faint); text-transform: uppercase;">Hours</div></div>
            <div style="font-size: 1.4rem; opacity: 0.4;">:</div>
            <div style="text-align: center;"><div class="count-num" style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #ffffff;" id="cd-mins">22</div><div style="font-size: 0.65rem; color: var(--text-faint); text-transform: uppercase;">Mins</div></div>
            <div style="font-size: 1.4rem; opacity: 0.4;">:</div>
            <div style="text-align: center;"><div class="count-num" style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #34d399;" id="cd-secs">48</div><div style="font-size: 0.65rem; color: var(--text-faint); text-transform: uppercase;">Secs</div></div>
          </div>
        </div>

        <!-- Description & Highlights -->
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">About This Experience</h3>
        <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.8rem;">${evt.description}</p>

        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Key Highlights</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem; margin-bottom: 2rem;">
          ${evt.highlights.map(h => `
            <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.875rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${h}</span>
            </div>
          `).join("")}
        </div>

        <!-- Venue Details -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2.5rem;">
          <div style="font-size: 0.75rem; color: #60a5fa; text-transform: uppercase; font-weight: 700;">Venue & Accessibility</div>
          <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.3rem 0;">${evt.location}</h4>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.75rem;">${evt.venueAddress}</p>
          <div style="font-size: 0.813rem; color: var(--text-faint);">Direct metro connection, wheelchair accessible ramps, and reserved EV charging stations available.</div>
        </div>

        <!-- Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase;">Starting At</div>
            <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: #ffffff;">${evt.currency}${evt.price}</div>
          </div>
          <button class="btn btn-primary btn-lg" id="modal-reserve-btn">
            Reserve Your Seat Now
          </button>
        </div>
      </div>
    `;

    document.getElementById("modal-reserve-btn").addEventListener("click", () => {
      closeModal(dom.eventDetailsModal);
      openBookingModal(evt.id);
    });

    // Start live countdown ticking
    let secsLeft = 48;
    countdownInterval = setInterval(() => {
      secsLeft = secsLeft > 0 ? secsLeft - 1 : 59;
      const secEl = document.getElementById("cd-secs");
      if (secEl) secEl.textContent = secsLeft.toString().padStart(2, "0");
    }, 1000);

    openModal(dom.eventDetailsModal);
  }

  // ==========================================================================
  // MULTI-STEP TICKET BOOKING FLOW
  // ==========================================================================
  function openBookingModal(eventId) {
    const evt = state.events.find(e => e.id === eventId);
    if (!evt) return;

    state.bookingEvent = evt;
    state.bookingStep = 1;
    state.selectedTier = evt.ticketTiers[0];
    state.promoCode = "";
    state.promoDiscount = 0;
    state.attendeeData = {
      fullName: "Alexander Hayes",
      email: "a.hayes@frontierlabs.io",
      company: "Cognitive Frontier Labs",
      jobTitle: "Principal Systems Engineer"
    };

    renderBookingStep();
    openModal(dom.bookingModal);
  }

  function renderBookingStep() {
    const evt = state.bookingEvent;
    if (!evt) return;

    // Update stepper visual indicators
    const stepNodes = dom.bookingModal.querySelectorAll(".step-node");
    stepNodes.forEach((node, i) => {
      const stepNum = i + 1;
      node.classList.toggle("active", stepNum === state.bookingStep);
      node.classList.toggle("completed", stepNum < state.bookingStep);
    });

    if (state.bookingStep === 1) {
      // Step 1: Select Ticket Tier
      dom.bookingModalBody.innerHTML = `
        <div class="booking-step-content">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Step 1: Select Ticket Pass Tier
          </h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
            Choose your delegate credential tier for <strong>${evt.title}</strong>.
          </p>

          <div class="tier-options-list">
            ${evt.ticketTiers.map(tier => `
              <div class="tier-select-card ${tier.id === state.selectedTier.id ? 'selected' : ''}" data-tier-id="${tier.id}">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
                    <span style="font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: #ffffff;">${tier.name}</span>
                    <span class="badge badge-blue">${tier.badge}</span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem;">
                    ${tier.perks.map(p => `
                      <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ${p}
                      </span>
                    `).join("")}
                  </div>
                </div>
                <div style="text-align: right; min-width: 110px;">
                  <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: #ffffff;">${evt.currency}${tier.price}</div>
                  <div style="font-size: 0.75rem; color: #34d399;">${tier.available} passes left</div>
                </div>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
            <button class="btn btn-primary" id="booking-btn-step1">
              Continue to Attendee Info →
            </button>
          </div>
        </div>
      `;

      dom.bookingModalBody.querySelectorAll(".tier-select-card").forEach(card => {
        card.addEventListener("click", () => {
          const tierId = card.dataset.tierId;
          state.selectedTier = evt.ticketTiers.find(t => t.id === tierId);
          renderBookingStep();
        });
      });

      document.getElementById("booking-btn-step1").addEventListener("click", () => {
        state.bookingStep = 2;
        renderBookingStep();
      });

    } else if (state.bookingStep === 2) {
      // Step 2: Attendee Info
      dom.bookingModalBody.innerHTML = `
        <div class="booking-step-content">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Step 2: Attendee & Badge Details
          </h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
            These credentials will be printed on your official summit NFC smart badge.
          </p>

          <form id="attendee-info-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="form-fullname" value="${state.attendeeData.fullName}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Work Email</label>
                <input type="email" class="form-control" id="form-email" value="${state.attendeeData.email}" required />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Company / Organization</label>
                <input type="text" class="form-control" id="form-company" value="${state.attendeeData.company}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Job Title / Designation</label>
                <input type="text" class="form-control" id="form-job" value="${state.attendeeData.jobTitle}" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Dietary Preferences & Accessibility Requirements</label>
              <select class="form-control" id="form-diet">
                <option value="none">Standard Catering (No Restrictions)</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan / Plant-Based</option>
                <option value="halal">Halal Certified</option>
                <option value="gluten">Gluten-Free</option>
              </select>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
              <button type="button" class="btn btn-secondary" id="booking-back-to-1">← Back</button>
              <button type="submit" class="btn btn-primary">Continue to Review & Payment →</button>
            </div>
          </form>
        </div>
      `;

      document.getElementById("booking-back-to-1").addEventListener("click", () => {
        state.bookingStep = 1;
        renderBookingStep();
      });

      document.getElementById("attendee-info-form").addEventListener("submit", (e) => {
        e.preventDefault();
        state.attendeeData.fullName = document.getElementById("form-fullname").value.trim();
        state.attendeeData.email = document.getElementById("form-email").value.trim();
        state.attendeeData.company = document.getElementById("form-company").value.trim();
        state.attendeeData.jobTitle = document.getElementById("form-job").value.trim();
        state.bookingStep = 3;
        renderBookingStep();
      });

    } else if (state.bookingStep === 3) {
      // Step 3: Review & Payment
      const tierPrice = state.selectedTier.price;
      const discount = state.promoDiscount > 0 ? (tierPrice * state.promoDiscount) : 0;
      const subtotal = tierPrice - discount;

      dom.bookingModalBody.innerHTML = `
        <div class="booking-step-content">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Step 3: Order Review & Secure Checkout
          </h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
            Review your registration summary and complete reservation.
          </p>

          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="color: var(--text-muted);">Event:</span>
              <strong style="color: #ffffff;">${evt.title}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="color: var(--text-muted);">Ticket Tier:</span>
              <strong style="color: #60a5fa;">${state.selectedTier.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="color: var(--text-muted);">Attendee:</span>
              <span style="color: #ffffff;">${state.attendeeData.fullName} (${state.attendeeData.company})</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="color: var(--text-muted);">Base Price:</span>
              <span style="color: #ffffff;">${evt.currency}${tierPrice.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: #10b981;">
                <span>Discount Promo (20% OFF):</span>
                <span>-${evt.currency}${discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 1.2rem; font-weight: 800;">
              <span>Total Due:</span>
              <span style="color: #34d399;">${evt.currency}${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <!-- Promo Code Input -->
          <div style="display: flex; gap: 0.6rem; margin-bottom: 1.5rem;">
            <input type="text" class="form-control" id="promo-code-input" placeholder="Promo code (Try: EVENTORA20)" value="${state.promoCode}" />
            <button type="button" class="btn btn-secondary" id="apply-promo-btn" style="white-space: nowrap;">Apply Code</button>
          </div>

          <!-- Simulated Payment Options -->
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; margin-bottom: 0.6rem;">Payment Method</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div style="border: 1px solid var(--primary-blue); background: rgba(59, 130, 246, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem;">
                <input type="radio" name="payment-method" checked />
                <span style="font-size: 0.875rem; font-weight: 600;">Credit / Debit Card (Instant)</span>
              </div>
              <div style="border: 1px solid var(--border-subtle); background: rgba(255, 255, 255, 0.02); padding: 0.75rem 1rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.6rem;">
                <input type="radio" name="payment-method" />
                <span style="font-size: 0.875rem; font-weight: 600;">Corporate Invoice / Wire</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
            <button type="button" class="btn btn-secondary" id="booking-back-to-2">← Back</button>
            <button type="button" class="btn btn-primary" id="booking-confirm-pay-btn">
              Authorize Payment & Confirm Reservation →
            </button>
          </div>
        </div>
      `;

      document.getElementById("apply-promo-btn").addEventListener("click", () => {
        const val = document.getElementById("promo-code-input").value.trim().toUpperCase();
        if (val === "EVENTORA20") {
          state.promoCode = val;
          state.promoDiscount = 0.20;
          showToast("Promo Code Applied! 20% discount activated.", "success");
          renderBookingStep();
        } else {
          showToast("Invalid code. Enter 'EVENTORA20' for 20% off.", "error");
        }
      });

      document.getElementById("booking-back-to-2").addEventListener("click", () => {
        state.bookingStep = 2;
        renderBookingStep();
      });

      document.getElementById("booking-confirm-pay-btn").addEventListener("click", () => {
        // Create new ticket object
        const newTicketId = `EVT-${Math.floor(1000 + Math.random() * 9000)}-${state.selectedTier.name.substring(0, 3).toUpperCase()}`;
        const newTicket = {
          ticketId: newTicketId,
          eventId: evt.id,
          eventTitle: evt.title,
          attendeeName: state.attendeeData.fullName,
          attendeeEmail: state.attendeeData.email,
          tierName: state.selectedTier.name,
          pricePaid: `${evt.currency}${subtotal.toFixed(2)}`,
          purchaseDate: "Today",
          date: evt.date,
          time: evt.time,
          venue: evt.location,
          seat: "Smart Badge Section A",
          qrCodeData: `EVENTORA-AUTH:${newTicketId}:${state.attendeeData.fullName}:VERIFIED`,
          status: "Confirmed"
        };

        state.myTickets.unshift(newTicket);
        evt.attendeeCount += 1;
        state.bookingStep = 4;
        state.confirmedTicket = newTicket;
        renderBookingStep();
        showToast("You're officially registered! Digital pass ready.", "success");
      });

    } else if (state.bookingStep === 4) {
      // Step 4: Confirmation Screen & Digital Pass
      const ticket = state.confirmedTicket;

      dom.bookingModalBody.innerHTML = `
        <div class="booking-step-content" style="text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; color: #10b981;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.4rem;">
            You're Officially Registered!
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem;">
            A confirmation receipt and calendar invitation have been dispatched to <strong>${ticket.attendeeEmail}</strong>.
          </p>

          <!-- Render Visual Digital Pass -->
          <div class="digital-ticket-card" id="generated-ticket-pass">
            <div class="ticket-header-strip">
              <div style="display: flex; align-items: center; gap: 0.6rem; font-weight: 800; font-size: 1rem; color: #ffffff;">
                <span>EVENTORA SMART PASS</span>
              </div>
              <span class="badge" style="background: rgba(0, 0, 0, 0.35); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2);">${ticket.tierName}</span>
            </div>

            <div class="ticket-body-split">
              <div class="ticket-notch-left"></div>
              <div class="ticket-notch-right"></div>
              
              <div class="ticket-main-info" style="text-align: left;">
                <div style="font-size: 0.75rem; color: #60a5fa; text-transform: uppercase; font-weight: 700; margin-bottom: 0.3rem;">Official Delegate Pass</div>
                <h4 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; line-height: 1.3; margin-bottom: 1rem; color: #ffffff;">${ticket.eventTitle}</h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div>
                    <div style="font-size: 0.7rem; color: var(--text-faint); text-transform: uppercase;">Delegate</div>
                    <div style="font-weight: 700; font-size: 0.95rem;">${ticket.attendeeName}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.7rem; color: var(--text-faint); text-transform: uppercase;">Ticket Ref #</div>
                    <div style="font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem; color: #a5b4fc;">${ticket.ticketId}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <div style="font-size: 0.7rem; color: var(--text-faint); text-transform: uppercase;">Date & Time</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${ticket.date}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.7rem; color: var(--text-faint); text-transform: uppercase;">Venue Location</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${ticket.venue}</div>
                  </div>
                </div>
              </div>

              <div class="ticket-qr-side">
                <div class="qr-box">
                  ${generateSvgQrCode(ticket.qrCodeData)}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-faint); letter-spacing: 0.05em;">SCAN AT GATE</div>
              </div>
            </div>

            <div class="ticket-footer-strip">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Status: <span style="color: #34d399; font-weight: 700;">CONFIRMED & ACTIVE</span></div>
              <div style="font-size: 0.75rem; color: var(--text-faint);">Eventora Verified Security Hash</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
            <button class="btn btn-primary" id="btn-print-pass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print / Save PDF
            </button>
            <button class="btn btn-secondary" id="btn-add-calendar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Add to Calendar (.ics)
            </button>
            <button class="btn btn-outline" id="btn-done-booking">
              Done
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-print-pass").addEventListener("click", () => {
        window.print();
      });

      document.getElementById("btn-add-calendar").addEventListener("click", () => {
        showToast("Calendar invite (.ics) synced to your device!", "success");
      });

      document.getElementById("btn-done-booking").addEventListener("click", () => {
        closeModal(dom.bookingModal);
        renderAttendeeDashboardTickets();
      });
    }
  }

  // ==========================================================================
  // DYNAMIC SVG QR CODE GENERATOR (Client-side, no dependencies)
  // ==========================================================================
  function generateSvgQrCode(dataString) {
    // Generates a crisp high-tech matrix pattern resembling standard 2D QR barcode
    const size = 100;
    const modules = 21;
    const cellSize = size / modules;

    // Deterministic pseudo-random seed from string
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
      hash |= 0;
    }

    let rects = "";
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Corner alignment boxes (standard QR markers)
        const isTopLeft = (r < 7 && c < 7);
        const isTopRight = (r < 7 && c >= modules - 7);
        const isBottomLeft = (r >= modules - 7 && c < 7);

        let isDark = false;
        if (isTopLeft) {
          isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        } else if (isTopRight) {
          isDark = (r === 0 || r === 6 || c === modules - 7 || c === modules - 1 || (r >= 2 && r <= 4 && c >= modules - 5 && c <= modules - 3));
        } else if (isBottomLeft) {
          isDark = (r === modules - 7 || r === modules - 1 || c === 0 || c === 6 || (r >= modules - 5 && r <= modules - 3 && c >= 2 && c <= 4));
        } else {
          // Inner data pattern
          const val = Math.sin((r * 13) + (c * 7) + hash) * 10000;
          isDark = (val - Math.floor(val)) > 0.48;
        }

        if (isDark) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
        }
      }
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#ffffff" />
        ${rects}
      </svg>
    `;
  }

  // ==========================================================================
  // ATTENDEE DASHBOARD ("My Tickets & Schedule")
  // ==========================================================================
  function renderAttendeeDashboardTickets() {
    const container = document.getElementById("attendee-tickets-list");
    if (!container) return;

    if (state.myTickets.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;">🎟️</div>
          <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.3rem;">No active ticket passes yet</h4>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.2rem;">Discover world-class tech conferences and reserve your seat today.</p>
          <button class="btn btn-primary btn-sm" id="btn-dash-explore">Explore Global Events</button>
        </div>
      `;
      const btn = document.getElementById("btn-dash-explore");
      if (btn) btn.addEventListener("click", () => switchView("public"));
      return;
    }

    container.innerHTML = state.myTickets.map(ticket => `
      <div class="glass-panel" style="padding: 1.8rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div style="width: 70px; height: 70px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
            ${generateSvgQrCode(ticket.qrCodeData)}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
              <span class="badge badge-blue">${ticket.tierName}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-faint);">${ticket.ticketId}</span>
            </div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-bottom: 0.3rem;">${ticket.eventTitle}</h4>
            <div style="font-size: 0.813rem; color: var(--text-muted);">
              <span>📅 ${ticket.date}</span> • <span>📍 ${ticket.venue}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="btn btn-secondary btn-sm btn-view-qr-pass" data-ticket-id="${ticket.ticketId}">
            Open Full Pass
          </button>
          <button class="btn btn-outline btn-sm btn-cal-sync">
            Sync Calendar
          </button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".btn-view-qr-pass").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticket = state.myTickets.find(t => t.ticketId === btn.dataset.ticketId);
        if (ticket) openTicketQrModal(ticket);
      });
    });

    container.querySelectorAll(".btn-cal-sync").forEach(btn => {
      btn.addEventListener("click", () => {
        showToast("Calendar sync completed successfully!", "success");
      });
    });
  }

  function openTicketQrModal(ticket) {
    if (!dom.ticketPreviewModal) return;
    const body = document.getElementById("ticket-preview-body");
    if (!body) return;

    body.innerHTML = `
      <div class="digital-ticket-card">
        <div class="ticket-header-strip">
          <span style="font-weight: 800; font-size: 1rem; color: #ffffff;">EVENTORA DIGITAL CREDENTIAL</span>
          <span class="badge badge-emerald">${ticket.tierName}</span>
        </div>
        <div class="ticket-body-split">
          <div class="ticket-notch-left"></div>
          <div class="ticket-notch-right"></div>
          <div class="ticket-main-info">
            <h3 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; margin-bottom: 0.75rem;">${ticket.eventTitle}</h3>
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.4rem;"><strong>Delegate:</strong> ${ticket.attendeeName}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.4rem;"><strong>Location:</strong> ${ticket.venue}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);"><strong>Dates:</strong> ${ticket.date}</div>
          </div>
          <div class="ticket-qr-side">
            <div class="qr-box">
              ${generateSvgQrCode(ticket.qrCodeData)}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #a5b4fc;">${ticket.ticketId}</div>
          </div>
        </div>
        <div class="ticket-footer-strip">
          <span style="font-size: 0.75rem; color: #34d399;">Active • Verified Badge</span>
          <button class="btn btn-primary btn-sm" onclick="window.print()">Print Ticket</button>
        </div>
      </div>
    `;
    openModal(dom.ticketPreviewModal);
  }

  // ==========================================================================
  // ORGANIZER SAAS DASHBOARD & INTERACTIVE CANVAS CHARTS
  // ==========================================================================
  function setupCanvasCharts() {
    const lineCanvas = document.getElementById("organizer-sales-chart");
    if (!lineCanvas) return;
    const ctx = lineCanvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = lineCanvas.getBoundingClientRect();
    lineCanvas.width = rect.width * dpr;
    lineCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padX = 40;
    const padY = 30;

    const data = EVENTORA_DATA.organizerStats.salesMonthly;
    const maxRev = 300000;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (h - padY * 2) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillText(`$${((maxRev - (maxRev * (i / 4))) / 1000).toFixed(0)}k`, 5, y + 3);
    }

    // Points calculation
    const points = data.map((d, i) => {
      const x = padX + (w - padX * 2) * (i / (data.length - 1));
      const y = h - padY - (d.revenue / maxRev) * (h - padY * 2);
      return { x, y, ...d };
    });

    // Gradient fill under line
    const grad = ctx.createLinearGradient(0, padY, 0, h - padY);
    grad.addColorStop(0, "rgba(99, 102, 241, 0.35)");
    grad.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - padY);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - padY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data points & month labels
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
      ctx.strokeStyle = "#0b132b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Month text
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "11px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.month, p.x, h - 10);
    });

    // Draw Source Donut Chart
    setupDonutChart();
  }

  function setupDonutChart() {
    const donutCanvas = document.getElementById("organizer-sources-chart");
    if (!donutCanvas) return;
    const ctx = donutCanvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = donutCanvas.getBoundingClientRect();
    donutCanvas.width = rect.width * dpr;
    donutCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 25;
    const innerRadius = radius * 0.65;

    ctx.clearRect(0, 0, w, h);

    const sources = EVENTORA_DATA.organizerStats.sources;
    let startAngle = -Math.PI / 2;

    sources.forEach(src => {
      const sliceAngle = (src.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = src.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 1.2rem Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("14.8k", cx, cy - 8);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "10px Plus Jakarta Sans, sans-serif";
    ctx.fillText("ATTENDEES", cx, cy + 12);
  }

  function renderOrganizerAttendeesTable() {
    const tbody = document.getElementById("organizer-attendees-tbody");
    if (!tbody) return;

    const txs = EVENTORA_DATA.organizerStats.recentTransactions;
    tbody.innerHTML = txs.map(tx => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.813rem; color: #a5b4fc;">${tx.id}</td>
        <td><strong style="color: #ffffff;">${tx.buyer}</strong></td>
        <td>${tx.event}</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #34d399;">${tx.amount}</td>
        <td>${tx.date}</td>
        <td><span class="badge badge-emerald">${tx.status}</span></td>
      </tr>
    `).join("");
  }

  // ==========================================================================
  // CREATE EVENT WIZARD
  // ==========================================================================
  function setupCreateEventWizard() {
    const form = document.getElementById("create-event-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const title = document.getElementById("ce-title").value.trim();
      const category = document.getElementById("ce-category").value;
      const format = document.getElementById("ce-format").value;
      const date = document.getElementById("ce-date").value.trim() || "Nov 12 - 14, 2026";
      const city = document.getElementById("ce-city").value.trim() || "Global";
      const price = parseFloat(document.getElementById("ce-price").value) || 299;
      const desc = document.getElementById("ce-desc").value.trim();

      const newEvent = {
        id: `evt-${Date.now()}`,
        title: title,
        tagline: desc.substring(0, 110) + "...",
        category: category,
        format: format,
        date: date,
        startDate: "2026-11-12",
        endDate: "2026-11-14",
        time: "09:00 AM - 05:30 PM",
        location: `${city} Convention Pavilion`,
        city: city,
        venueAddress: `Official Event Center, ${city}`,
        organizer: {
          name: "Eventora Verified Host",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
          eventsHosted: 1
        },
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        price: price,
        currency: "$",
        attendeeCount: 1,
        capacity: 1000,
        description: desc,
        highlights: [
          "Live international streaming & plenary keynotes",
          "Dedicated B2B matchmaking lounges",
          "Official smart NFC badge credentials"
        ],
        ticketTiers: [
          {
            id: "tier-std",
            name: "General Delegate Pass",
            price: price,
            badge: "General",
            perks: ["All Sessions & Expo Hall", "Lunch & Evening Reception"],
            available: 250
          }
        ],
        speakers: ["spk-1", "spk-3"]
      };

      state.events.unshift(newEvent);
      EVENTORA_DATA.organizerStats.totalEvents += 1;
      
      closeModal(dom.createEventModal);
      form.reset();
      showToast(`🎉 "${newEvent.title}" published live to global discovery!`, "success");
      renderEvents();
      switchView("public");
    });
  }

  // ==========================================================================
  // NOTIFICATIONS & GLOBAL SEARCH
  // ==========================================================================
  function renderNotifications() {
    if (!dom.notifList) return;
    
    const unreadCount = state.notifications.filter(n => n.unread).length;
    if (dom.notifBadge) {
      dom.notifBadge.textContent = unreadCount;
      dom.notifBadge.style.display = unreadCount > 0 ? "flex" : "none";
    }

    dom.notifList.innerHTML = state.notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
        <div style="font-size: 1.2rem; line-height: 1;">🔔</div>
        <div>
          <div style="font-size: 0.875rem; font-weight: 700; color: #ffffff; margin-bottom: 0.2rem;">${n.title}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.3rem;">${n.desc}</div>
          <div style="font-size: 0.65rem; color: var(--text-faint);">${n.time}</div>
        </div>
      </div>
    `).join("");
  }

  function setupGlobalSearch() {
    const input = document.getElementById("global-search-input");
    const resultsContainer = document.getElementById("global-search-results");
    if (!input || !resultsContainer) return;

    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-faint);">Start typing to search events, speakers, or sessions...</div>`;
        return;
      }

      // Search events
      const matchedEvents = state.events.filter(ev => ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q));
      // Search speakers
      const matchedSpeakers = state.speakers.filter(s => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q));

      resultsContainer.innerHTML = `
        <div style="padding: 1rem 0;">
          <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; margin-bottom: 0.75rem;">Events (${matchedEvents.length})</div>
          ${matchedEvents.length ? matchedEvents.slice(0, 3).map(ev => `
            <div class="search-result-row" data-action="event" data-id="${ev.id}" style="padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <div>
                <div style="font-size: 0.875rem; font-weight: 600; color: #ffffff;">${ev.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${ev.location} • ${ev.date}</div>
              </div>
              <span class="badge badge-blue btn-sm">View</span>
            </div>
          `).join("") : '<div style="font-size: 0.813rem; color: var(--text-faint); margin-bottom: 0.5rem;">No matching events</div>'}

          <div style="font-size: 0.75rem; color: var(--text-faint); text-transform: uppercase; font-weight: 700; margin: 1rem 0 0.75rem;">Speakers (${matchedSpeakers.length})</div>
          ${matchedSpeakers.length ? matchedSpeakers.slice(0, 3).map(s => `
            <div class="search-result-row" data-action="speaker" data-id="${s.id}" style="padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <img src="${s.avatar}" style="width: 28px; height: 28px; border-radius: 50%;" />
              <div>
                <div style="font-size: 0.875rem; font-weight: 600; color: #ffffff;">${s.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${s.title} • ${s.company}</div>
              </div>
            </div>
          `).join("") : '<div style="font-size: 0.813rem; color: var(--text-faint);">No matching speakers</div>'}
        </div>
      `;

      resultsContainer.querySelectorAll(".search-result-row").forEach(row => {
        row.addEventListener("click", () => {
          closeModal(dom.globalSearchModal);
          if (row.dataset.action === "event") {
            openEventDetails(row.dataset.id);
          } else {
            showToast("Showing speaker profile", "info");
          }
        });
      });
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = "info") {
    if (!dom.toastContainer) return;
    
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const iconSvg = type === "success" 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : type === "error"
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `
      <div>${iconSvg}</div>
      <div style="flex-grow: 1;">${message}</div>
    `;

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "all 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================================================
  // MODAL UTILITIES
  // ==========================================================================
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // ==========================================================================
  // ANIMATED COUNTERS
  // ==========================================================================
  function setupAnimatedCounters() {
    const counterEls = document.querySelectorAll(".about-stat-value");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current.toLocaleString() + (el.dataset.suffix || "");
          }, 25);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterEls.forEach(c => observer.observe(c));
  }

  // ==========================================================================
  // GENERAL EVENT LISTENERS & WIRING
  // ==========================================================================
  function setupEventListeners() {
    // Search input
    if (dom.searchInput) {
      dom.searchInput.addEventListener("input", (e) => {
        state.filterSearch = e.target.value;
        renderEvents();
      });
    }

    // Format select
    if (dom.formatSelect) {
      dom.formatSelect.addEventListener("change", (e) => {
        state.filterFormat = e.target.value;
        renderEvents();
      });
    }

    // Sort select
    if (dom.sortSelect) {
      dom.sortSelect.addEventListener("change", (e) => {
        state.filterSort = e.target.value;
        renderEvents();
      });
    }

    // Presenter mode bar pills
    dom.modePills.forEach(pill => {
      pill.addEventListener("click", () => {
        switchView(pill.dataset.view);
      });
    });

    // Nav "Create Event" buttons
    document.querySelectorAll(".btn-open-create-event").forEach(btn => {
      btn.addEventListener("click", () => {
        openModal(dom.createEventModal);
      });
    });

    // Nav "Explore Events" buttons
    document.querySelectorAll(".btn-nav-explore").forEach(btn => {
      btn.addEventListener("click", () => {
        switchView("public");
        const el = document.getElementById("discovery-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Nav Search trigger
    if (dom.navSearchBtn) {
      dom.navSearchBtn.addEventListener("click", () => {
        openModal(dom.globalSearchModal);
        const inp = document.getElementById("global-search-input");
        if (inp) inp.focus();
      });
    }

    // Nav Notifications trigger
    if (dom.navNotifBtn && dom.notifDropdown) {
      dom.navNotifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dom.notifDropdown.classList.toggle("active");
        // Mark all as read
        state.notifications.forEach(n => n.unread = false);
        renderNotifications();
      });

      document.addEventListener("click", (e) => {
        if (!dom.notifDropdown.contains(e.target) && e.target !== dom.navNotifBtn) {
          dom.notifDropdown.classList.remove("active");
        }
      });
    }

    // Nav Sign in / Auth modal
    document.querySelectorAll(".btn-open-auth").forEach(btn => {
      btn.addEventListener("click", () => {
        openModal(dom.authModal);
      });
    });

    // Mobile menu drawer
    if (dom.mobileMenuBtn && dom.mobileMenuDrawer) {
      dom.mobileMenuBtn.addEventListener("click", () => {
        dom.mobileMenuDrawer.classList.toggle("active");
      });
    }

    // All Modal Close Buttons
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        closeModal(modal);
      });
    });

    // Modal background click to close
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    });

    // Keyboard Shortcuts (Esc to close, / to search)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openModal(dom.globalSearchModal);
        const inp = document.getElementById("global-search-input");
        if (inp) inp.focus();
      }
    });

    // Pricing Billing Period Toggle
    const toggleOpts = document.querySelectorAll(".pricing-toggle-btn .toggle-opt");
    toggleOpts.forEach(opt => {
      opt.addEventListener("click", () => {
        toggleOpts.forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        const billing = opt.dataset.billing;
        document.querySelectorAll(".pricing-card").forEach(card => {
          const priceEl = card.querySelector(".pricing-price");
          if (priceEl && card.dataset.monthly && card.dataset.annual) {
            priceEl.innerHTML = billing === "annual" 
              ? `$${card.dataset.annual}<span>/mo (billed annually)</span>` 
              : `$${card.dataset.monthly}<span>/month</span>`;
          }
        });
      });
    });

    // Setup wizards & search
    setupCreateEventWizard();
    setupGlobalSearch();
  }

  // --- Bootstrap on DOM Ready ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
