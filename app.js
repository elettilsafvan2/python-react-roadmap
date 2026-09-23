// =========================================================
// Python + React Fullstack Self-Learning App Logic
// Interactive syllabus, progress tracking, persistence & animations
// =========================================================

(function () {
  "use strict";

  // STORAGE KEYS
  const STORAGE_COMPLETED_KEY = "fullstack_completed_days_v1";
  const STORAGE_NOTES_KEY = "fullstack_user_notes_v1";
  const STORAGE_THEME_KEY = "fullstack_app_theme_v1";
  const STORAGE_QUIZ_KEY = "fullstack_quiz_scores_v1";
  const STORAGE_SUBTASKS_KEY = "fullstack_subtasks_v1";

  // STATE
  let completedDays = new Set(JSON.parse(localStorage.getItem(STORAGE_COMPLETED_KEY) || "[]"));
  let userNotes = JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY) || "{}");
  let quizScores = JSON.parse(localStorage.getItem(STORAGE_QUIZ_KEY) || "{}");
  let completedSubtasks = JSON.parse(localStorage.getItem(STORAGE_SUBTASKS_KEY) || "{}");
  let currentPhase = 0; // 0 = All
  let currentFilter = "all"; // 'all' | 'pending' | 'completed'
  let searchQuery = "";
  let currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || "dark";

  // PYODIDE WASM SINGLETON
  let pyodideInstance = null;
  let isPyodideLoading = false;

  // DOM ELEMENTS
  const syllabusListEl = document.getElementById("syllabus-list");
  const overallProgressEl = document.getElementById("overall-progress-text");
  const overallPercentEl = document.getElementById("overall-percent-text");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const statCompletedEl = document.getElementById("stat-completed-days");
  const statRemainingEl = document.getElementById("stat-remaining-days");
  const statQuizScoreEl = document.getElementById("stat-quiz-score");
  const statPercentBadgeEl = document.getElementById("stat-percent-badge");
  
  const phase1Fill = document.getElementById("phase-1-fill");
  const phase1Label = document.getElementById("phase-1-label");
  const phase2Fill = document.getElementById("phase-2-fill");
  const phase2Label = document.getElementById("phase-2-label");
  const phase3Fill = document.getElementById("phase-3-fill");
  const phase3Label = document.getElementById("phase-3-label");

  const searchInput = document.getElementById("search-input");
  const phaseTabs = document.querySelectorAll(".tab-btn");
  const filterPills = document.querySelectorAll(".filter-pill");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const cheatsheetBtn = document.getElementById("cheatsheet-btn");
  const cheatsheetModal = document.getElementById("cheatsheet-modal");
  const closeCheatModal = document.getElementById("close-cheat-modal");
  const resetBtn = document.getElementById("reset-btn");
  const toastContainer = document.getElementById("toast-container");
  const confettiCanvas = document.getElementById("confetti-canvas");

  // GOOGLE AI STUDIO / GEMINI ASSISTANT
  const STORAGE_GEMINI_KEY = "google_ai_studio_api_key";
  const headerAiBtn = document.getElementById("header-ai-btn");
  const aiFab = document.getElementById("ai-fab");
  const aiFabDot = document.getElementById("ai-fab-dot");
  const aiDrawer = document.getElementById("ai-drawer");
  const closeAiDrawerBtn = document.getElementById("close-ai-drawer");
  const aiSettingsBtn = document.getElementById("ai-settings-btn");
  const aiKeyBox = document.getElementById("ai-key-box");
  const aiKeyInput = document.getElementById("ai-key-input");
  const saveAiKeyBtn = document.getElementById("save-ai-key-btn");
  const aiKeyStatus = document.getElementById("ai-key-status");
  const aiContextChip = document.getElementById("ai-context-chip");
  const aiIncludeCodeToggle = document.getElementById("ai-include-code-toggle");
  const aiMessagesEl = document.getElementById("ai-messages");
  const aiSuggestionsEl = document.getElementById("ai-suggestions");
  const aiUserInput = document.getElementById("ai-user-input");
  const aiSendBtn = document.getElementById("ai-send-btn");

  let aiConversationHistory = [];
  let isAiGenerating = false;

  // SUPABASE CONFIGURATION
  const SUPABASE_URL = "https://gtjcynyvarlwzbnrabos.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0amN5bnl2YXJsd3pibnJhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMTY4MjgsImV4cCI6MjEwNTY5MjgyOH0.tHKutDalGg2Kzflo53mdypTRgOdyljyh5iL4oMbV59M";
  const SUPABASE_TABLE = "user_progress";
  const USER_ID = "default_user";

  const cloudSyncBtn = document.getElementById("cloud-sync-btn");
  const cloudIndicator = document.getElementById("cloud-indicator");
  const cloudStatusText = document.getElementById("cloud-status-text");

  function setCloudStatus(status, text) {
    if (!cloudIndicator || !cloudStatusText) return;
    cloudIndicator.className = `cloud-indicator ${status}`;
    cloudStatusText.textContent = text;
  }

  // FETCH PROGRESS FROM SUPABASE CLOUD
  async function fetchSupabaseProgress(isManual) {
    setCloudStatus("syncing", "Syncing...");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${USER_ID}`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const cloudRecord = data[0];
        const cloudCompleted = Array.isArray(cloudRecord.completed_days) ? cloudRecord.completed_days : [];
        const cloudNotes = cloudRecord.notes && typeof cloudRecord.notes === "object" ? cloudRecord.notes : {};
        const cloudQuizzes = cloudRecord.quiz_scores && typeof cloudRecord.quiz_scores === "object" ? cloudRecord.quiz_scores : {};
        const cloudSubtasks = cloudRecord.completed_subtasks && typeof cloudRecord.completed_subtasks === "object" ? cloudRecord.completed_subtasks : {};

        let changed = false;

        // Merge cloud with local completed days
        cloudCompleted.forEach((dayId) => {
          if (!completedDays.has(dayId)) {
            completedDays.add(dayId);
            changed = true;
          }
        });

        // Merge notes (prefer non-empty)
        Object.entries(cloudNotes).forEach(([key, val]) => {
          if (val && !userNotes[key]) {
            userNotes[key] = val;
            changed = true;
          }
        });

        // Merge quizzes (preserve correct answers)
        Object.entries(cloudQuizzes).forEach(([key, val]) => {
          if (val && val.isCorrect && (!quizScores[key] || !quizScores[key].isCorrect)) {
            quizScores[key] = val;
            changed = true;
          }
        });

        // Merge subtasks
        Object.entries(cloudSubtasks).forEach(([key, val]) => {
          if (val && !completedSubtasks[key]) {
            completedSubtasks[key] = true;
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(completedDays)));
          localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
          localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quizScores));
          localStorage.setItem(STORAGE_SUBTASKS_KEY, JSON.stringify(completedSubtasks));
          renderSyllabus();
          updateProgressStats();
        } else {
          // If local has unique items not in cloud, sync local up
          const hasLocalUnique = Array.from(completedDays).some(d => !cloudCompleted.includes(d));
          if (hasLocalUnique) {
            syncToSupabase();
          }
        }

        setCloudStatus("online", "Cloud Synced");
        if (isManual) showToast("Synced with Supabase Cloud! ☁️");
      } else {
        syncToSupabase();
      }
    } catch (err) {
      console.warn("Supabase fetch failed, operating in offline/localStorage mode:", err);
      setCloudStatus("offline", "Local Mode");
      if (isManual) showToast("Offline mode. Progress saved locally.");
    }
  }

  // SYNC PROGRESS TO SUPABASE CLOUD
  async function syncToSupabase() {
    setCloudStatus("syncing", "Saving...");
    try {
      const payload = {
        id: USER_ID,
        completed_days: Array.from(completedDays),
        notes: userNotes,
        quiz_scores: quizScores,
        completed_subtasks: completedSubtasks,
        theme: currentTheme,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${USER_ID}`, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setCloudStatus("online", "Cloud Synced");
    } catch (err) {
      console.warn("Supabase sync failed:", err);
      setCloudStatus("offline", "Local Mode");
    }
  }

  const debouncedSyncToSupabase = debounce(() => syncToSupabase(), 800);

  // INITIALIZATION
  function init() {
    applyTheme(currentTheme);
    renderSyllabus();
    updateProgressStats();
    attachEventListeners();
    initAiAssistant();
    fetchSupabaseProgress(false);
    checkHashRoute();
    window.addEventListener("hashchange", checkHashRoute);
  }

  // THEME SWITCHER
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
      themeIcon.innerHTML = theme === "light" 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }

  // CIRCULAR MASK THEME TRANSITION
  function toggleThemeWithAnimation(event) {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Animate button icon spin
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
      themeIcon.classList.remove("icon-spin");
      void themeIcon.offsetWidth; // trigger reflow
      themeIcon.classList.add("icon-spin");
    }

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme(newTheme);
      return;
    }

    // Determine the center point (x, y) of the circular mask
    let x, y;
    if (event && (event.clientX || event.clientY)) {
      x = event.clientX;
      y = event.clientY;
    } else if (themeToggleBtn) {
      const rect = themeToggleBtn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = window.innerWidth / 2;
      y = 0;
    }

    // Radius needed to reach the farthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Modern Native View Transition API (Chrome, Safari 18+, Edge)
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
      return;
    }

    // Fallback Mask Overlay for other browsers
    const overlay = document.createElement("div");
    overlay.className = "theme-mask-overlay";
    overlay.style.backgroundColor = newTheme === "dark" ? "#0b0f19" : "#f8fafc";
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
      setTimeout(() => {
        applyTheme(newTheme);
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.25s ease";
        setTimeout(() => {
          overlay.remove();
        }, 250);
      }, 480);
    });
  }

  // RENDER SYLLABUS LIST
  function renderSyllabus() {
    if (!syllabusListEl) return;

    // Filter data
    const filteredItems = SYLLABUS_DATA.filter((item) => {
      // Phase Filter
      if (currentPhase !== 0 && item.phase !== currentPhase) {
        return false;
      }
      // Status Filter
      const isDone = completedDays.has(item.id);
      if (currentFilter === "pending" && isDone) return false;
      if (currentFilter === "completed" && !isDone) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSummary = item.summary.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        const matchDetails = item.details.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);
        if (!matchTitle && !matchSummary && !matchCategory && !matchDetails && !matchCode) {
          return false;
        }
      }

      return true;
    });

    if (filteredItems.length === 0) {
      syllabusListEl.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3>No matching modules found</h3>
          <p>Try adjusting your search query or phase filter.</p>
        </div>
      `;
      return;
    }

    syllabusListEl.innerHTML = filteredItems.map((item) => createCardHtml(item)).join("");

    // Attach card event listeners
    attachCardListeners();
  }

  // ACTIVE WORKSPACE STATE
  let currentOpenDayId = null;

  // HASH ROUTE LISTENER
  function checkHashRoute() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#day-")) {
      const dayNum = parseInt(hash.replace("#day-", ""), 10);
      const item = SYLLABUS_DATA.find((d) => d.day === dayNum);
      if (item) {
        openDayWorkspace(item.id, false);
        return;
      }
    }
    closeDayWorkspace(false);
  }

  // CREATE ROADMAP CARD HTML (Clean overview with Open Workspace CTA)
  function createCardHtml(item) {
    const isDone = completedDays.has(item.id);
    const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
    const doneSubtasksCount = subtasks.filter((s) => !!completedSubtasks[s.id]).length;
    const savedQuiz = quizScores[item.id] || null;
    const isQuizCorrect = savedQuiz && savedQuiz.isCorrect;

    return `
      <article class="day-card ${isDone ? "completed" : ""}" id="card-${item.id}" data-id="${item.id}">
        <div class="day-card-header" data-id="${item.id}">
          <div class="custom-checkbox-wrap" onclick="event.stopPropagation();">
            <input 
              type="checkbox" 
              id="check-${item.id}" 
              class="card-checkbox" 
              data-id="${item.id}" 
              ${isDone ? "checked" : ""} 
              title="Mark as completed"
            />
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <div class="day-info" data-action="open-workspace" data-id="${item.id}">
            <div class="day-meta">
              <span class="badge-day">Day ${item.day}</span>
              <span class="badge-category">${escapeHtml(item.category)}</span>
              <span class="badge-week">${item.week}</span>
            </div>
            <h3 class="day-title">${escapeHtml(item.title)}</h3>
            <p class="day-summary">${escapeHtml(item.summary)}</p>
            <div style="display:flex; align-items:center; gap:0.6rem; margin-top:0.4rem; flex-wrap:wrap;">
              <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted); background:var(--bg-surface); padding:0.15rem 0.5rem; border-radius:4px;">
                📋 ${doneSubtasksCount} / ${subtasks.length} Tasks
              </span>
              <span style="font-size:0.75rem; font-weight:600; color:${isQuizCorrect ? '#34d399' : 'var(--text-muted)'}; background:var(--bg-surface); padding:0.15rem 0.5rem; border-radius:4px;">
                ${isQuizCorrect ? '✓ Quiz Won' : '💡 Quiz Pending'}
              </span>
              <span class="card-open-link" data-id="${item.id}">
                Open Workspace &amp; VS Code →
              </span>
            </div>
          </div>

          <button class="expand-btn" aria-label="Open Workspace" data-action="open-workspace" data-id="${item.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  // ATTACH ROADMAP CARD LISTENERS
  function attachCardListeners() {
    // Checkbox toggles
    document.querySelectorAll(".card-checkbox").forEach((cb) => {
      cb.addEventListener("change", function (e) {
        e.stopPropagation();
        const id = this.getAttribute("data-id");
        toggleDayCompletion(id, this.checked);
      });
    });

    // Card click / button click opens Deep Day Workspace
    document.querySelectorAll(".day-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".custom-checkbox-wrap")) return;
        const id = this.getAttribute("data-id");
        if (id) openDayWorkspace(id, true);
      });
    });
  }

  // OPEN DEEP DAY WORKSPACE (Full VS Code & Curriculum View)
  function openDayWorkspace(dayId, updateHash = true) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item) return;

    currentOpenDayId = dayId;
    updateAiContextChip();
    const isDone = completedDays.has(item.id);
    const savedNote = userNotes[item.id] || "";
    const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
    const doneSubtasksCount = subtasks.filter((s) => !!completedSubtasks[s.id]).length;
    const quiz = item.quiz || null;
    const savedQuiz = quizScores[item.id] || null;
    const isQuizAnswered = !!savedQuiz;
    const isQuizCorrect = savedQuiz && savedQuiz.isCorrect;

    // Previous and Next Days
    const prevItem = SYLLABUS_DATA.find((d) => d.day === item.day - 1);
    const nextItem = SYLLABUS_DATA.find((d) => d.day === item.day + 1);

    const isPython = (item.codeLanguage || "").toLowerCase().includes("python");
    const fileName = isPython ? "main.py" : "App.jsx";
    const fileIcon = isPython ? "🐍" : "⚛️";
    const langBadge = isPython ? "Python 3.12 (WASM)" : "JavaScript JSX";

    const curriculumView = document.getElementById("curriculum-view");
    const workspaceView = document.getElementById("day-workspace-view");
    if (!workspaceView) return;

    if (curriculumView) curriculumView.style.display = "none";
    workspaceView.style.display = "flex";

    if (updateHash) {
      window.location.hash = `day-${item.day}`;
    }

    workspaceView.innerHTML = `
      <!-- Top Workspace Navigation Bar -->
      <header class="workspace-topbar">
        <div class="workspace-topbar-left">
          <button class="btn-back-curriculum" id="btn-back-curriculum">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Roadmap</span>
          </button>
          <div class="workspace-title-group">
            <span class="workspace-day-pill">Day ${item.day}</span>
            <span class="badge-category">${escapeHtml(item.category)}</span>
            <h2 class="workspace-title">${escapeHtml(item.title)}</h2>
          </div>
        </div>

        <div class="workspace-topbar-right">
          <button class="workspace-nav-btn" id="btn-prev-day" ${prevItem ? "" : "disabled"} title="${prevItem ? `Go to Day ${prevItem.day}` : ""}">
            ‹ Day ${prevItem ? prevItem.day : "-"}
          </button>
          <button class="workspace-nav-btn" id="btn-next-day" ${nextItem ? "" : "disabled"} title="${nextItem ? `Go to Day ${nextItem.day}` : ""}">
            Day ${nextItem ? nextItem.day : "-"} ›
          </button>
          <button class="workspace-complete-toggle ${isDone ? "completed" : ""}" id="btn-toggle-day-done">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${isDone ? "Completed ✓" : "Mark as Done"}</span>
          </button>
        </div>
      </header>

      <!-- Two-Column Grid: Deep Guide Left, VS Code Right -->
      <div class="workspace-grid">
        <!-- Left Pane: Guidance, Subtasks, Quizzes, Notes -->
        <div class="workspace-left-pane">
          <!-- Core Concept & Detailed Guide -->
          <div class="content-block" style="background:var(--bg-card); padding:1.25rem 1.4rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div class="block-title" style="margin-bottom:0.6rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Core Concept &amp; Detailed Guide
            </div>
            <p class="block-text" style="font-size:0.96rem; line-height:1.7;">${escapeHtml(item.details)}</p>
          </div>

          <!-- Structured Action Tasks Checklist -->
          ${subtasks.length > 0 ? `
            <div class="subtasks-box">
              <div class="subtasks-header">
                <span class="subtasks-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Action Tasks (ഇന്ന് ചെയ്യേണ്ട കാര്യങ്ങൾ)
                </span>
                <span class="subtasks-progress-badge" id="subtasks-badge-${item.id}">
                  ${doneSubtasksCount} / ${subtasks.length} Done
                </span>
              </div>
              <div class="subtasks-list">
                ${subtasks.map((sub) => {
                  const isChecked = !!completedSubtasks[sub.id];
                  return `
                    <label class="subtask-item ${isChecked ? "checked" : ""}" id="label-${sub.id}">
                      <input 
                        type="checkbox" 
                        class="subtask-checkbox" 
                        data-subid="${sub.id}" 
                        data-dayid="${item.id}" 
                        ${isChecked ? "checked" : ""} 
                      />
                      <span class="subtask-text">${escapeHtml(sub.text)}</span>
                    </label>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Daily Concept Check Quiz -->
          ${quiz ? `
            <div class="quiz-container" id="quiz-box-${item.id}">
              <div class="quiz-header">
                <span class="quiz-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Concept Check Quiz
                </span>
                <span class="quiz-score-pill" id="quiz-badge-${item.id}">
                  ${isQuizAnswered ? (isQuizCorrect ? "✓ Won (+1 Pt)" : "Review &amp; Retry") : "+1 Knowledge Pt"}
                </span>
              </div>
              <p class="quiz-question">${escapeHtml(quiz.question)}</p>
              <div class="quiz-options">
                ${quiz.options.map((opt, oIdx) => {
                  const letters = ["A", "B", "C", "D"];
                  let optClass = "quiz-opt-btn";
                  let disabledAttr = "";
                  if (isQuizAnswered) {
                    if (oIdx === quiz.correctIndex) optClass += " correct";
                    else if (oIdx === savedQuiz.answeredIndex && !isQuizCorrect) optClass += " wrong";
                    if (isQuizCorrect) disabledAttr = "disabled";
                  }
                  return `
                    <button class="${optClass}" data-day="${item.id}" data-opt="${oIdx}" ${disabledAttr}>
                      <span class="quiz-letter">${letters[oIdx]}</span>
                      <span class="quiz-opt-text">${escapeHtml(opt)}</span>
                    </button>
                  `;
                }).join("")}
              </div>
              <div 
                class="quiz-explanation ${isQuizAnswered ? (isQuizCorrect ? "correct-exp" : "wrong-exp") : ""}" 
                id="quiz-exp-${item.id}" 
                style="${isQuizAnswered ? "" : "display: none;"}"
              >
                <div class="quiz-explanation-header">
                  ${isQuizAnswered && isQuizCorrect ? "✓ Correct! Explanation:" : "💡 Review Hint &amp; Explanation:"}
                </div>
                <div>${escapeHtml(quiz.explanation)}</div>
              </div>
            </div>
          ` : ""}

          <!-- Pro Tip Callout -->
          <div class="callout-box callout-tip">
            <div class="callout-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="9" y1="18" x2="15" y2="18"></line>
                <line x1="10" y1="22" x2="14" y2="22"></line>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.64.78 1.08 1.52 1.26 2.5"></path>
              </svg>
              Pro Tip (ശ്രദ്ധിക്കേണ്ട കാര്യം)
            </div>
            <div>${escapeHtml(item.tip)}</div>
          </div>

          <!-- Personal Notes & Scratchpad -->
          <div class="notes-container" style="background:var(--bg-card); padding:1.25rem 1.4rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div class="notes-header">
              <label for="notes-${item.id}" class="block-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Personal Notes &amp; Observations
              </label>
              <span class="notes-status" id="note-status-${item.id}">Auto-saved</span>
            </div>
            <textarea 
              id="notes-${item.id}" 
              class="notes-textarea" 
              placeholder="Record your observations, key take-aways, or personal snippets here..."
              data-id="${item.id}"
            >${escapeHtml(savedNote)}</textarea>
          </div>
        </div>

        <!-- Right Pane: Real VS Code Experience -->
        <div class="workspace-right-pane">
          <div class="vscode-window">
            <!-- VS Code Tab Bar -->
            <div class="vscode-tabs-bar">
              <div class="vscode-tabs-group">
                <div class="vscode-tab active">
                  <span class="tab-icon">${fileIcon}</span>
                  <span class="tab-title">${fileName}</span>
                  <span class="tab-close">×</span>
                </div>
              </div>
              <div class="vscode-actions-toolbar">
                <button class="vscode-btn-run" id="ws-run-btn-${item.id}" data-day="${item.id}" data-lang="${escapeHtml(item.codeLanguage)}" title="Run in Integrated Terminal (Ctrl+Enter)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Run</span>
                </button>
                <button class="vscode-icon-btn" id="ws-reset-btn-${item.id}" data-day="${item.id}" title="Reset to Original Code">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
                <button class="vscode-icon-btn" id="ws-copy-btn-${item.id}" data-day="${item.id}" title="Copy Code">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- VS Code Breadcrumbs -->
            <div class="vscode-breadcrumbs">
              <span>workspace</span>
              <span class="crumb-sep">›</span>
              <span>day-${item.day}</span>
              <span class="crumb-sep">›</span>
              <span class="crumb-file">${fileName}</span>
            </div>

            <!-- Code Editor Body with Line Numbers Gutter -->
            <div class="vscode-editor-body">
              <div class="vscode-gutter" id="gutter-${item.id}"></div>
              <textarea 
                class="vscode-code-area" 
                id="editor-${item.id}" 
                data-day="${item.id}" 
                spellcheck="false"
              >${escapeHtml(item.code)}</textarea>
            </div>

            <!-- VS Code Integrated Terminal Panel -->
            <div class="vscode-terminal-panel">
              <div class="terminal-panel-header">
                <div class="panel-tabs">
                  <span class="panel-tab">PROBLEMS <span class="badge-zero">0</span></span>
                  <span class="panel-tab">OUTPUT</span>
                  <span class="panel-tab">DEBUG CONSOLE</span>
                  <span class="panel-tab active">TERMINAL</span>
                </div>
                <div class="panel-controls">
                  <span class="term-shell-select">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                    1: zsh
                  </span>
                  <span class="term-status-pill" id="term-status-${item.id}">Ready</span>
                  <button class="vscode-icon-btn" id="ws-clear-btn-${item.id}" title="Clear Terminal (Trash)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Terminal Screen & Interactive Input Stream -->
              <div class="vscode-terminal-screen" id="term-screen-${item.id}">
                <div class="term-log-stream" id="term-out-${item.id}">
                  <span class="term-prompt-line"><span class="term-user">apple@macbook</span>:<span class="term-dir">~/fullstack-workspace</span>$ </span><span class="term-dim-hint">Ready. Click "▶ Run" to execute code.</span>
                </div>
                <!-- Inline Terminal Prompt for input() -->
                <div class="term-interactive-row" id="term-row-${item.id}" style="display:none;">
                  <span class="term-prompt-prompt" id="term-prompt-text-${item.id}"></span>
                  <input type="text" class="term-live-input" id="term-input-${item.id}" autocomplete="off" spellcheck="false" />
                  <span class="term-enter-hint">↵ Enter</span>
                </div>
              </div>
            </div>

            <!-- VS Code Status Bar -->
            <div class="vscode-statusbar">
              <div class="status-left">
                <span class="status-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg> main*</span>
                <span class="status-item">⊗ 0  ▲ 0</span>
              </div>
              <div class="status-right">
                <span class="status-item" id="status-cursor-${item.id}">Ln 1, Col 1</span>
                <span class="status-item">Spaces: 4</span>
                <span class="status-item">UTF-8</span>
                <span class="status-item">${langBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach all interactive workspace events
    attachWorkspaceListeners(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // CLOSE DEEP WORKSPACE AND RETURN TO ROADMAP
  function closeDayWorkspace(updateHash = true) {
    currentOpenDayId = null;
    updateAiContextChip();
    const curriculumView = document.getElementById("curriculum-view");
    const workspaceView = document.getElementById("day-workspace-view");

    if (workspaceView) {
      workspaceView.style.display = "none";
      workspaceView.innerHTML = "";
    }
    if (curriculumView) {
      curriculumView.style.display = "block";
    }

    if (updateHash) {
      history.pushState(null, null, " ");
    }

    renderSyllabus();
    updateProgressStats();
  }

  // ATTACH WORKSPACE LISTENERS FOR THE ACTIVE DAY
  function attachWorkspaceListeners(item) {
    const dayId = item.id;

    // Back to Roadmap button
    const backBtn = document.getElementById("btn-back-curriculum");
    if (backBtn) {
      backBtn.addEventListener("click", () => closeDayWorkspace(true));
    }

    // Prev / Next Day navigation
    const prevBtn = document.getElementById("btn-prev-day");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const prevItem = SYLLABUS_DATA.find((d) => d.day === item.day - 1);
        if (prevItem) openDayWorkspace(prevItem.id, true);
      });
    }

    const nextBtn = document.getElementById("btn-next-day");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nextItem = SYLLABUS_DATA.find((d) => d.day === item.day + 1);
        if (nextItem) openDayWorkspace(nextItem.id, true);
      });
    }

    // Toggle Day Completion
    const completeToggleBtn = document.getElementById("btn-toggle-day-done");
    if (completeToggleBtn) {
      completeToggleBtn.addEventListener("click", () => {
        const currentlyDone = completedDays.has(dayId);
        toggleDayCompletion(dayId, !currentlyDone);
        const newDone = completedDays.has(dayId);
        completeToggleBtn.className = `workspace-complete-toggle ${newDone ? "completed" : ""}`;
        completeToggleBtn.querySelector("span").textContent = newDone ? "Completed ✓" : "Mark as Done";
      });
    }

    // Gutter Line Numbers calculation & scroll sync
    const editor = document.getElementById(`editor-${dayId}`);
    const gutter = document.getElementById(`gutter-${dayId}`);
    const cursorStatus = document.getElementById(`status-cursor-${dayId}`);

    function refreshGutter() {
      if (!editor || !gutter) return;
      const lines = editor.value.split("\n").length;
      gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
    }

    if (editor) {
      refreshGutter();

      editor.addEventListener("input", () => {
        refreshGutter();
      });

      editor.addEventListener("scroll", () => {
        if (gutter) gutter.scrollTop = editor.scrollTop;
      });

      // Cursor position Ln X, Col Y tracker
      function updateCursorPosition() {
        if (!cursorStatus || !editor) return;
        const textToCursor = editor.value.substring(0, editor.selectionStart);
        const lines = textToCursor.split("\n");
        const ln = lines.length;
        const col = lines[lines.length - 1].length + 1;
        cursorStatus.textContent = `Ln ${ln}, Col ${col}`;
      }

      editor.addEventListener("keyup", updateCursorPosition);
      editor.addEventListener("click", updateCursorPosition);

      // Tab key indentation support (4 spaces)
      editor.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
          refreshGutter();
          updateCursorPosition();
        } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          // Ctrl+Enter or Cmd+Enter to Run
          e.preventDefault();
          const runBtn = document.getElementById(`ws-run-btn-${dayId}`);
          if (runBtn) runBtn.click();
        }
      });
    }

    // Run Code Button
    const runBtn = document.getElementById(`ws-run-btn-${dayId}`);
    if (runBtn) {
      runBtn.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        const code = editor ? editor.value : "";
        executeCodeRunner(dayId, lang, code, this);
      });
    }

    // Reset Starter Code
    const resetBtn = document.getElementById(`ws-reset-btn-${dayId}`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (editor) {
          editor.value = item.code;
          refreshGutter();
          showToast("Code reset to starter template! ↺");
        }
      });
    }

    // Copy Code Button
    const copyBtn = document.getElementById(`ws-copy-btn-${dayId}`);
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        if (editor) copyToClipboard(editor.value, copyBtn);
      });
    }

    // Clear Terminal Button
    const clearBtn = document.getElementById(`ws-clear-btn-${dayId}`);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const out = document.getElementById(`term-out-${dayId}`);
        const status = document.getElementById(`term-status-${dayId}`);
        if (out) {
          out.innerHTML = `<span class="term-prompt-line"><span class="term-user">apple@macbook</span>:<span class="term-dir">~/fullstack-workspace</span>$ </span><span class="term-dim-hint">Terminal cleared.</span>`;
        }
        if (status) {
          status.className = "term-status-pill";
          status.textContent = "Ready";
        }
      });
    }

    // Subtasks Checklist Checkboxes
    document.querySelectorAll(".subtask-checkbox").forEach((cb) => {
      cb.addEventListener("change", function () {
        const subId = this.getAttribute("data-subid");
        const label = document.getElementById(`label-${subId}`);

        if (this.checked) {
          completedSubtasks[subId] = true;
          if (label) label.classList.add("checked");
        } else {
          delete completedSubtasks[subId];
          if (label) label.classList.remove("checked");
        }

        localStorage.setItem(STORAGE_SUBTASKS_KEY, JSON.stringify(completedSubtasks));
        debouncedSyncToSupabase();

        // Update subtasks count badge
        if (item.subtasks) {
          const doneCount = item.subtasks.filter((s) => !!completedSubtasks[s.id]).length;
          const badge = document.getElementById(`subtasks-badge-${dayId}`);
          if (badge) {
            badge.textContent = `${doneCount} / ${item.subtasks.length} Done`;
          }

          // If all subtasks completed, mark the day as completed!
          if (doneCount === item.subtasks.length && !completedDays.has(dayId)) {
            toggleDayCompletion(dayId, true);
            const completeToggle = document.getElementById("btn-toggle-day-done");
            if (completeToggle) {
              completeToggle.className = "workspace-complete-toggle completed";
              completeToggle.querySelector("span").textContent = "Completed ✓";
            }
            showToast("All daily tasks completed! Day marked as complete 🎯");
          }
        }
      });
    });

    // Quiz Options Click
    document.querySelectorAll(".quiz-opt-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const optIdx = parseInt(this.getAttribute("data-opt"), 10);
        handleQuizAnswer(dayId, optIdx);
      });
    });

    // Notes auto-save with debounce
    const notesArea = document.getElementById(`notes-${dayId}`);
    if (notesArea) {
      notesArea.addEventListener("input", debounce(function () {
        userNotes[dayId] = this.value;
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
        debouncedSyncToSupabase();
        
        const statusBadge = document.getElementById(`note-status-${dayId}`);
        if (statusBadge) {
          statusBadge.textContent = "Saved ✓";
          setTimeout(() => {
            if (statusBadge) statusBadge.textContent = "Auto-saved";
          }, 1500);
        }
      }, 400));
    }
  }

  // REAL-TIME TERMINAL OUTPUT STREAM
  window._writeToTerminal = function (dayId, text, isError) {
    const logStream = document.getElementById(`term-out-${dayId}`);
    const screen = document.getElementById(`term-screen-${dayId}`);
    if (!logStream) return;

    const span = document.createElement("span");
    if (isError) span.className = "term-stderr";
    span.textContent = text;
    logStream.appendChild(span);
    if (screen) screen.scrollTop = screen.scrollHeight;
  };

  // REAL-TIME IN-TERMINAL INTERACTIVE INPUT PROMPT
  window._requestTerminalInput = function (dayId, promptText) {
    return new Promise((resolve) => {
      const row = document.getElementById(`term-row-${dayId}`);
      const input = document.getElementById(`term-input-${dayId}`);
      const promptSpan = document.getElementById(`term-prompt-text-${dayId}`);
      const logStream = document.getElementById(`term-out-${dayId}`);
      const screen = document.getElementById(`term-screen-${dayId}`);

      if (!row || !input) {
        resolve("");
        return;
      }

      if (promptSpan) promptSpan.textContent = promptText || "";
      row.style.display = "flex";
      input.value = "";
      setTimeout(() => input.focus(), 30);
      if (screen) screen.scrollTop = screen.scrollHeight;

      const commit = () => {
        const val = input.value;
        row.style.display = "none";
        if (promptSpan) promptSpan.textContent = "";

        if (logStream) {
          const line = document.createElement("div");
          line.innerHTML = `<span class="term-prompt-prompt">${escapeHtml(promptText)}</span><span class="term-user-text">${escapeHtml(val)}</span>`;
          logStream.appendChild(line);
        }
        if (screen) screen.scrollTop = screen.scrollHeight;
        resolve(val);
      };

      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
      };

      const enterHint = row.querySelector(".term-enter-hint");
      if (enterHint) {
        enterHint.onclick = () => commit();
      }
    });
  };

  // QUIZ ANSWER HANDLER
  function handleQuizAnswer(dayId, selectedIdx) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item || !item.quiz) return;

    const quiz = item.quiz;
    const isCorrect = selectedIdx === quiz.correctIndex;
    quizScores[dayId] = { answeredIndex: selectedIdx, isCorrect: isCorrect };
    localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quizScores));
    debouncedSyncToSupabase();

    // Update Quiz UI in card
    const quizBox = document.getElementById(`quiz-box-${dayId}`);
    if (!quizBox) return;

    const optButtons = quizBox.querySelectorAll(".quiz-opt-btn");
    optButtons.forEach((btn, idx) => {
      btn.classList.remove("correct", "wrong");
      if (idx === quiz.correctIndex) {
        btn.classList.add("correct");
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add("wrong");
      }
      if (isCorrect) {
        btn.disabled = true;
      }
    });

    const badge = document.getElementById(`quiz-badge-${dayId}`);
    if (badge) {
      badge.textContent = isCorrect ? "✓ Won (+1 Pt)" : "Review & Retry";
    }

    const expEl = document.getElementById(`quiz-exp-${dayId}`);
    if (expEl) {
      expEl.style.display = "block";
      expEl.className = `quiz-explanation ${isCorrect ? "correct-exp" : "wrong-exp"}`;
      expEl.innerHTML = `
        <div class="quiz-explanation-header">
          ${isCorrect ? "✓ Correct! Explanation:" : "💡 Review Hint &amp; Explanation:"}
        </div>
        <div>${escapeHtml(quiz.explanation)}</div>
      `;
    }

    updateQuizScoreStat();

    if (isCorrect) {
      showToast("Correct Answer! +1 Knowledge Point 🧠⚡");
      fireCelebration("milestone");
    } else {
      showToast("Review the explanation and try again! 💡");
    }
  }

  // UPDATE QUIZ SCORE STAT BADGE
  function updateQuizScoreStat() {
    if (!statQuizScoreEl) return;
    const wonCount = Object.values(quizScores).filter((q) => q && q.isCorrect).length;
    statQuizScoreEl.textContent = `Quiz: ${wonCount} / 42 Pts`;
  }

  // LAZY-LOAD PYODIDE WASM ENGINE
  async function getPyodide() {
    if (pyodideInstance) return pyodideInstance;
    if (typeof loadPyodide === "undefined") {
      throw new Error("Pyodide WebAssembly runtime is still downloading. Please ensure network access and refresh.");
    }
    if (isPyodideLoading) {
      while (isPyodideLoading) {
        await new Promise((r) => setTimeout(r, 120));
      }
      return pyodideInstance;
    }

    isPyodideLoading = true;
    try {
      showToast("Initializing WebAssembly Python (WASM)... 🐍");
      pyodideInstance = await loadPyodide();
      return pyodideInstance;
    } finally {
      isPyodideLoading = false;
    }
  }

  // CODE EXECUTION DISPATCHER
  async function executeCodeRunner(dayId, lang, code, runBtn) {
    const statusEl = document.getElementById(`term-status-${dayId}`);
    const logStream = document.getElementById(`term-out-${dayId}`);
    const screen = document.getElementById(`term-screen-${dayId}`);
    if (!statusEl) return;

    if (runBtn) {
      runBtn.classList.add("running");
      runBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Running...</span>
      `;
    }

    statusEl.className = "term-status-pill running";
    statusEl.textContent = "Running...";

    // Print command invocation line
    const isPython = (lang || "").toLowerCase().includes("python");
    const cmdLine = isPython ? "python3 main.py" : "node App.jsx";
    if (logStream) {
      logStream.innerHTML = `<div class="term-prompt-line"><span class="term-user">apple@macbook</span>:<span class="term-dir">~/fullstack-workspace</span>$ <span style="color:#ffffff;">${cmdLine}</span></div>`;
    }
    if (screen) screen.scrollTop = screen.scrollHeight;

    try {
      if (isPython) {
        await runPythonCode(dayId, code, statusEl);
      } else {
        runJsCode(dayId, code, statusEl);
      }
    } finally {
      if (runBtn) {
        runBtn.classList.remove("running");
        runBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Run</span>
        `;
      }
    }
  }

  // EXECUTE PYTHON IN PYODIDE WASM WITH REAL-TIME STREAMING & IN-TERMINAL INPUT
  async function runPythonCode(dayId, code, statusEl) {
    const startTime = performance.now();

    try {
      const py = await getPyodide();

      // Transform input(...) into await _async_input(...)
      const transformedCode = code.replace(/\binput\s*\(/g, "await _async_input(");
      const indentedCode = transformedCode
        .split("\n")
        .map((line) => "    " + line)
        .join("\n");

      const wrapperScript = `
import sys
import io
import builtins
import js

_orig_stdout = sys.stdout
_orig_stderr = sys.stderr
_orig_stdin = sys.stdin
_orig_input = builtins.input

class _VscodeRealtimeStdout:
    def write(self, s):
        if s:
            js.window._writeToTerminal("${dayId}", str(s), False)
        return len(s) if s else 0
    def flush(self):
        pass

class _VscodeRealtimeStderr:
    def write(self, s):
        if s:
            js.window._writeToTerminal("${dayId}", str(s), True)
        return len(s) if s else 0
    def flush(self):
        pass

sys.stdout = _VscodeRealtimeStdout()
sys.stderr = _VscodeRealtimeStderr()

async def _async_input(prompt_text=""):
    prompt_str = str(prompt_text) if prompt_text else ""
    val = await js.window._requestTerminalInput("${dayId}", prompt_str)
    return str(val) if val is not None else ""

# Fallback for synchronous input inside untransformed scopes
def _sync_input(prompt_text=""):
    prompt_str = str(prompt_text) if prompt_text else ""
    if prompt_str:
        sys.stdout.write(prompt_str)
    val = js.prompt(prompt_str if prompt_str else "Enter input for Python:")
    if val is None: val = ""
    sys.stdout.write(val + "\\n")
    return val

builtins.input = _sync_input

# Provide graceful mock for uvicorn server in WASM browser sandbox
class _MockUvicorn:
    @staticmethod
    def run(app, *args, **kwargs):
        host = kwargs.get('host', '127.0.0.1')
        port = kwargs.get('port', 8000)
        print(f"[Sandbox API] Server simulated on http://{host}:{port}")
        print("[Sandbox API] Application routes registered & active.")

sys.modules['uvicorn'] = _MockUvicorn

async def _main():
${indentedCode}

try:
    await _main()
finally:
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr
    sys.stdin = _orig_stdin
    builtins.input = _orig_input
`;

      await py.runPythonAsync(wrapperScript);
      const duration = Math.round(performance.now() - startTime);

      statusEl.className = "term-status-pill success";
      statusEl.textContent = `Success (${duration}ms)`;
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      statusEl.className = "term-status-pill error";
      statusEl.textContent = `Error (${duration}ms)`;

      let cleanMsg = (err.message || String(err)).replace(/File "<exec>", /g, "");
      window._writeToTerminal(dayId, `\nTraceback (most recent call last):\n${cleanMsg}\n`, true);
    }
  }

  // EXECUTE JAVASCRIPT / REACT CODE IN REAL-TIME
  function runJsCode(dayId, code, statusEl) {
    const startTime = performance.now();

    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args) => {
      const text = args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ");
      window._writeToTerminal(dayId, text + "\n", false);
    };
    console.warn = (...args) => {
      const text = "[WARN] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ");
      window._writeToTerminal(dayId, text + "\n", false);
    };
    console.error = (...args) => {
      const text = "[ERROR] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ");
      window._writeToTerminal(dayId, text + "\n", true);
    };

    try {
      const result = new Function(code)();
      const duration = Math.round(performance.now() - startTime);

      statusEl.className = "term-status-pill success";
      statusEl.textContent = `Success (${duration}ms)`;

      if (result !== undefined) {
        const resStr = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
        window._writeToTerminal(dayId, "Return value: " + resStr + "\n", false);
      }
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      statusEl.className = "term-status-pill error";
      statusEl.textContent = `Error (${duration}ms)`;
      window._writeToTerminal(dayId, `${err.name}: ${err.message}\n`, true);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
    }
  }

  // TOGGLE DAY COMPLETION
  function toggleDayCompletion(id, isChecked) {
    const card = document.getElementById(`card-${id}`);
    const previousPercentage = Math.round((completedDays.size / SYLLABUS_DATA.length) * 100);

    if (isChecked) {
      completedDays.add(id);
      if (card) card.classList.add("completed");
      showToast("Module completed! 🎉");
    } else {
      completedDays.delete(id);
      if (card) card.classList.remove("completed");
    }

    localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(completedDays)));
    updateProgressStats();
    debouncedSyncToSupabase();

    // Check milestones for confetti
    const newPercentage = Math.round((completedDays.size / SYLLABUS_DATA.length) * 100);
    if (isChecked) {
      if (newPercentage === 100) {
        fireCelebration("graduation");
        showToast("🎓 Congratulations! Full curriculum completed!");
      } else if (
        (previousPercentage < 25 && newPercentage >= 25) ||
        (previousPercentage < 50 && newPercentage >= 50) ||
        (previousPercentage < 75 && newPercentage >= 75)
      ) {
        fireCelebration("milestone");
        showToast(`🚀 Milestone reached: ${newPercentage}% completed!`);
      }
    }
  }

  // UPDATE PROGRESS STATS & BARS
  function updateProgressStats() {
    const totalDays = SYLLABUS_DATA.length;
    const completedCount = completedDays.size;
    const remainingCount = totalDays - completedCount;
    const percent = Math.round((completedCount / totalDays) * 100);

    // Update overall numbers
    if (overallPercentEl) overallPercentEl.textContent = `${percent}%`;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
    if (statCompletedEl) statCompletedEl.textContent = `${completedCount}`;
    if (statRemainingEl) statRemainingEl.textContent = `${remainingCount} modules remaining`;
    if (overallProgressEl) overallProgressEl.textContent = `${completedCount} / ${totalDays} Modules`;

    // Phase breakdown calculations
    const p1Total = SYLLABUS_DATA.filter((i) => i.phase === 1).length;
    const p1Done = SYLLABUS_DATA.filter((i) => i.phase === 1 && completedDays.has(i.id)).length;
    const p1Pct = Math.round((p1Done / p1Total) * 100);
    if (phase1Fill) phase1Fill.style.width = `${p1Pct}%`;
    if (phase1Label) phase1Label.textContent = `${p1Done} / ${p1Total} (${p1Pct}%)`;

    const p2Total = SYLLABUS_DATA.filter((i) => i.phase === 2).length;
    const p2Done = SYLLABUS_DATA.filter((i) => i.phase === 2 && completedDays.has(i.id)).length;
    const p2Pct = Math.round((p2Done / p2Total) * 100);
    if (phase2Fill) phase2Fill.style.width = `${p2Pct}%`;
    if (phase2Label) phase2Label.textContent = `${p2Done} / ${p2Total} (${p2Pct}%)`;

    const p3Total = SYLLABUS_DATA.filter((i) => i.phase === 3).length;
    const p3Done = SYLLABUS_DATA.filter((i) => i.phase === 3 && completedDays.has(i.id)).length;
    const p3Pct = Math.round((p3Done / p3Total) * 100);
    if (phase3Fill) phase3Fill.style.width = `${p3Pct}%`;
    if (phase3Label) phase3Label.textContent = `${p3Done} / ${p3Total} (${p3Pct}%)`;

    // Update Tab count badges
    const allTabBadge = document.getElementById("tab-badge-all");
    const p1TabBadge = document.getElementById("tab-badge-p1");
    const p2TabBadge = document.getElementById("tab-badge-p2");
    const p3TabBadge = document.getElementById("tab-badge-p3");
    if (allTabBadge) allTabBadge.textContent = `${completedCount}/${totalDays}`;
    if (p1TabBadge) p1TabBadge.textContent = `${p1Done}/${p1Total}`;
    if (p2TabBadge) p2TabBadge.textContent = `${p2Done}/${p2Total}`;
    if (p3TabBadge) p3TabBadge.textContent = `${p3Done}/${p3Total}`;

    // Update Quiz Score Badges
    updateQuizScoreStat();
  }

  // ATTACH GLOBAL EVENT LISTENERS
  function attachEventListeners() {
    // Theme Toggle with circular mask animation
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", (e) => {
        toggleThemeWithAnimation(e);
      });
    }

    // Phase Tabs
    phaseTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        phaseTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        currentPhase = parseInt(this.getAttribute("data-phase"), 10);
        renderSyllabus();
      });
    });

    // Filter Pills
    filterPills.forEach((pill) => {
      pill.addEventListener("click", function () {
        filterPills.forEach((p) => p.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.getAttribute("data-filter");
        renderSyllabus();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener("input", debounce(function () {
        searchQuery = this.value;
        renderSyllabus();
      }, 250));
    }

    // Cheatsheet Modal Open/Close
    if (cheatsheetBtn && cheatsheetModal) {
      cheatsheetBtn.addEventListener("click", () => {
        cheatsheetModal.classList.add("open");
      });
    }

    if (closeCheatModal && cheatsheetModal) {
      closeCheatModal.addEventListener("click", () => {
        cheatsheetModal.classList.remove("open");
      });

      cheatsheetModal.addEventListener("click", (e) => {
        if (e.target === cheatsheetModal) {
          cheatsheetModal.classList.remove("open");
        }
      });
    }

    // Cloud Sync Button manual refresh
    if (cloudSyncBtn) {
      cloudSyncBtn.addEventListener("click", () => {
        fetchSupabaseProgress(true);
      });
    }

    // Reset Progress
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmed = confirm(
          "Reset all curriculum progress, quizzes, and tasks?"
        );
        if (confirmed) {
          completedDays.clear();
          quizScores = {};
          completedSubtasks = {};
          localStorage.removeItem(STORAGE_COMPLETED_KEY);
          localStorage.removeItem(STORAGE_QUIZ_KEY);
          localStorage.removeItem(STORAGE_SUBTASKS_KEY);
          renderSyllabus();
          updateProgressStats();
          debouncedSyncToSupabase();
          showToast("Progress, quizzes, and tasks reset successfully.");
        }
      });
    }
  }

  // COPY TO CLIPBOARD HELPER
  function copyToClipboard(text, btnElement) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopySuccess(btnElement);
      });
    } else {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showCopySuccess(btnElement);
    }
  }

  function showCopySuccess(btnElement) {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `✓ Copied!`;
    btnElement.style.borderColor = "var(--accent-emerald)";
    btnElement.style.color = "var(--accent-emerald)";
    setTimeout(() => {
      btnElement.innerHTML = originalText;
      btnElement.style.borderColor = "";
      btnElement.style.color = "";
    }, 1800);
    showToast("Code copied to clipboard!");
  }

  // TOAST HELPER
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>⚡</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // CONFETTI CELEBRATION
  function fireCelebration(type) {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = [];
    const particleCount = type === "graduation" ? 140 : 70;
    const colors = ["#38bdf8", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#a855f7"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    let animationFrame;
    function renderConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderConfetti();
  }

  // UTILITY HELPERS
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =========================================================
  // GOOGLE AI STUDIO / GEMINI ASSISTANT INTEGRATION
  // =========================================================

  const GEMINI_CANDIDATE_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-2.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  let activeGeminiModel = localStorage.getItem("preferred_gemini_model") || null;

  function updateModelBadge(modelName) {
    const badge = document.getElementById("ai-model-label");
    if (badge && modelName) {
      badge.textContent = `Google AI Studio • ${modelName}`;
    }
  }

  async function resolveBestGeminiModel(apiKey) {
    if (activeGeminiModel) {
      updateModelBadge(activeGeminiModel);
      return activeGeminiModel;
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      if (res.ok) {
        const data = await res.json();
        const models = Array.isArray(data.models) ? data.models : [];
        const supported = models.filter((m) => {
          const methods = m.supportedGenerationMethods || [];
          return methods.includes("generateContent");
        });

        // 1. Try finding a flash model
        const flash = supported.find((m) => m.name && m.name.includes("flash"));
        // 2. Try any Gemini model
        const any = flash || supported.find((m) => m.name && m.name.includes("gemini")) || supported[0];

        if (any && any.name) {
          const cleanName = any.name.replace(/^models\//, "");
          activeGeminiModel = cleanName;
          localStorage.setItem("preferred_gemini_model", cleanName);
          updateModelBadge(cleanName);
          return cleanName;
        }
      }
    } catch (e) {
      console.warn("Could not list Gemini models:", e);
    }

    return "gemini-2.0-flash";
  }

  function getGeminiApiKey() {
    return (localStorage.getItem(STORAGE_GEMINI_KEY) || "").trim();
  }

  function updateAiKeyStatus() {
    const key = getGeminiApiKey();
    if (aiFabDot) {
      if (key) {
        aiFabDot.classList.add("active");
        aiFabDot.title = "Google AI Studio API Key Connected";
      } else {
        aiFabDot.classList.remove("active");
        aiFabDot.title = "Google AI Studio API Key not configured";
      }
    }

    if (aiKeyInput) {
      aiKeyInput.value = key ? "••••••••••••••••••••••••" : "";
    }

    if (aiKeyStatus) {
      if (key) {
        aiKeyStatus.style.color = "var(--accent-emerald)";
        const masked = key.length > 10 ? `${key.slice(0, 6)}...${key.slice(-4)}` : "Set";
        aiKeyStatus.innerHTML = `✓ Key active (${escapeHtml(masked)})`;
      } else {
        aiKeyStatus.style.color = "var(--accent-amber)";
        aiKeyStatus.innerHTML = `⚠️ API Key not configured yet.`;
      }
    }
  }

  function toggleAiKeyBox(forceShow) {
    if (!aiKeyBox) return;
    const isCurrentlyHidden = window.getComputedStyle(aiKeyBox).display === "none";
    const show = typeof forceShow === "boolean" ? forceShow : isCurrentlyHidden;
    aiKeyBox.style.display = show ? "block" : "none";
    if (show && aiKeyInput) {
      const key = getGeminiApiKey();
      if (!key) {
        aiKeyInput.value = "";
        aiKeyInput.focus();
      }
    }
  }

  function saveGeminiApiKey() {
    if (!aiKeyInput) return;
    const val = aiKeyInput.value.trim();

    // If unchanged masked value, just close
    if (val.startsWith("••••")) {
      toggleAiKeyBox(false);
      return;
    }

    if (val) {
      if (!val.startsWith("AIzaSy")) {
        const proceed = confirm("Usually Google AI Studio keys start with 'AIzaSy'. Are you sure you want to save this key?");
        if (!proceed) return;
      }
      localStorage.setItem(STORAGE_GEMINI_KEY, val);
      localStorage.removeItem("preferred_gemini_model");
      activeGeminiModel = null;
      showToast("Google AI Studio Key saved! ✨");
      updateAiKeyStatus();
      toggleAiKeyBox(false);
      resolveBestGeminiModel(val);
    } else {
      localStorage.removeItem(STORAGE_GEMINI_KEY);
      localStorage.removeItem("preferred_gemini_model");
      activeGeminiModel = null;
      showToast("API key removed.");
      updateAiKeyStatus();
    }
  }

  function openAiDrawer() {
    if (!aiDrawer) return;
    aiDrawer.classList.add("open");
    updateAiContextChip();
    updateAiKeyStatus();
    if (aiMessagesEl) {
      aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
    }
    if (aiUserInput) {
      setTimeout(() => aiUserInput.focus(), 150);
    }
  }

  function closeAiDrawer() {
    if (!aiDrawer) return;
    aiDrawer.classList.remove("open");
  }

  function updateAiContextChip() {
    if (!aiContextChip) return;
    if (currentOpenDayId) {
      const item = SYLLABUS_DATA.find((d) => d.id === currentOpenDayId);
      if (item) {
        aiContextChip.textContent = `📍 Day ${item.day}: ${item.title}`;
        aiContextChip.title = `Context active: Day ${item.day} - ${item.title} (${item.codeLanguage})`;
        return;
      }
    }
    aiContextChip.textContent = "📚 General Roadmap Help";
    aiContextChip.title = "Roadmap Overview (42 Days Fullstack)";
  }

  // Safe markdown to HTML formatter for AI responses
  function formatAiResponse(rawText) {
    if (!rawText) return "";

    // Extract code blocks first to protect their syntax
    const codeBlocks = [];
    let text = rawText.replace(/```([a-zA-Z0-9_\-\.]*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ lang: lang ? lang.trim() : "code", code: code.replace(/\n$/, "") });
      return placeholder;
    });

    // Escape raw HTML characters
    text = escapeHtml(text);

    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic *text*
    text = text.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, "$1<em>$2</em>$3");

    // Inline `code`
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Headings
    text = text.replace(/^### (.*$)/gim, '<div style="font-weight:700; margin:0.45rem 0 0.2rem; font-size:0.95rem; color:var(--text-primary);">$1</div>');
    text = text.replace(/^## (.*$)/gim, '<div style="font-weight:700; margin:0.55rem 0 0.25rem; font-size:1.02rem; color:var(--text-primary);">$1</div>');
    text = text.replace(/^# (.*$)/gim, '<div style="font-weight:800; margin:0.65rem 0 0.3rem; font-size:1.1rem; color:var(--text-primary);">$1</div>');

    // Bullet items
    text = text.replace(/^\s*[\-\*]\s+(.*$)/gim, '<div style="display:flex; gap:0.45rem; margin:0.25rem 0;"><span style="color:#a855f7;">•</span><span>$1</span></div>');

    // Numbered lists 1. item
    text = text.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div style="display:flex; gap:0.45rem; margin:0.25rem 0;"><span style="color:#38bdf8; font-weight:700; font-size:0.82rem;">$1.</span><span>$2</span></div>');

    // Line breaks
    text = text.replace(/\n/g, "<br>");

    // Reinsert code blocks with VS Code styled header & Copy button
    codeBlocks.forEach((item, idx) => {
      const escapedCode = escapeHtml(item.code);
      const langLabel = item.lang.toUpperCase() || "CODE";
      const blockHtml = `
        <div class="ai-pre-wrapper" style="margin:0.65rem 0; border-radius:6px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); background:#080c14;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.35rem 0.75rem; background:rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.72rem; color:var(--text-muted); font-family:var(--font-code);">
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="color:#38bdf8;">●</span> ${escapeHtml(langLabel)}</span>
            <button class="ai-snippet-copy btn-editor-subtle" style="padding:0.15rem 0.45rem; font-size:0.7rem; border-radius:4px;" title="Copy Code">Copy</button>
          </div>
          <pre style="margin:0; padding:0.75rem 0.95rem; overflow-x:auto; background:transparent;"><code class="language-${escapeHtml(item.lang)}">${escapedCode}</code></pre>
        </div>
      `;
      text = text.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
    });

    return text;
  }

  // SEND AI MESSAGE
  async function sendAiMessage(promptText) {
    if (isAiGenerating) return;

    const rawInput = (promptText !== undefined ? promptText : (aiUserInput ? aiUserInput.value : "")).trim();
    if (!rawInput) return;

    // Reset input field
    if (aiUserInput && promptText === undefined) {
      aiUserInput.value = "";
      aiUserInput.style.height = "auto";
    }

    // Append User Message to Chat Bubble
    appendChatMessage("user", escapeHtml(rawInput));

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      appendChatMessage(
        "bot",
        `⚠️ <strong>Google AI Studio API Key ആവശ്യമാണ്!</strong><br><br>
        1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:var(--accent-cyan); text-decoration:underline;">aistudio.google.com/app/apikey</a> സന്ദർശിച്ച് സൗജന്യമായി (Free) ഒരു API key ഉണ്ടാക്കുക.<br>
        2. മുകളിലുള്ള 🔑 ബോക്സിൽ കീ പേസ്റ്റ് ചെയ്ത് <strong>Save</strong> ക്ലിക്ക് ചെയ്യുക.<br><br>
        തുടർന്ന് നിങ്ങളുടെ കോഡിംഗ് സംശയങ്ങൾ ചോദിക്കാം! 😊`
      );
      toggleAiKeyBox(true);
      return;
    }

    // Prepare Contextual Payload
    let contextPrompt = "";
    let activeItem = null;

    if (currentOpenDayId) {
      activeItem = SYLLABUS_DATA.find((d) => d.id === currentOpenDayId);
    }

    const includeCode = aiIncludeCodeToggle ? aiIncludeCodeToggle.checked : true;
    let editorCode = "";
    if (activeItem && includeCode) {
      const liveEditor = document.getElementById(`editor-${activeItem.id}`);
      editorCode = liveEditor ? liveEditor.value : activeItem.code;
    }

    if (activeItem) {
      contextPrompt = `[CONTEXT - LEARNING DAY ${activeItem.day}]:
Topic: ${activeItem.title}
Category: ${activeItem.category}
Details: ${activeItem.details}
Pro Tip: ${activeItem.tip}
${includeCode && editorCode ? `Active Editor Code (${activeItem.codeLanguage}):\n\`\`\`${activeItem.codeLanguage}\n${editorCode}\n\`\`\`` : ""}

Student's Question: ${rawInput}`;
    } else {
      contextPrompt = `[CONTEXT - 42-DAY FULLSTACK CURRICULUM OVERVIEW]:
Student's Question: ${rawInput}`;
    }

    // Add Bot Typing Indicator
    const typingBubbleId = "ai-typing-" + Date.now();
    const loadingHtml = `
      <div class="ai-msg bot" id="${typingBubbleId}">
        <div class="ai-avatar">✨</div>
        <div class="ai-bubble">
          <div class="ai-typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    if (aiMessagesEl) {
      aiMessagesEl.insertAdjacentHTML("beforeend", loadingHtml);
      aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
    }

    isAiGenerating = true;
    if (aiSendBtn) aiSendBtn.disabled = true;

    try {
      // Build conversation contents (up to 6 past conversational turns for context memory)
      const contentsPayload = [];
      const historySlice = aiConversationHistory.slice(-6);
      historySlice.forEach((h) => {
        contentsPayload.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });

      contentsPayload.push({
        role: "user",
        parts: [{ text: contextPrompt }]
      });

      // Discover or retrieve best model for this API key
      const preferred = await resolveBestGeminiModel(apiKey);
      const modelsToTry = [preferred, ...GEMINI_CANDIDATE_MODELS].filter((v, i, a) => v && a.indexOf(v) === i);

      let response = null;
      let usedModel = "";
      let lastErrMsg = "";

      for (const model of modelsToTry) {
        usedModel = model;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: contentsPayload,
              systemInstruction: {
                parts: [{
                  text: "You are an expert, encouraging, and friendly AI Coding Tutor for a 42-day Python + React Fullstack Engineering course for a student in Kerala, India. Understand Malayalam, Manglish, and English. When the student speaks in Malayalam or Manglish, reply in encouraging Malayalam/Manglish + English technical terms. Explain WHY things work and how to fix errors with clean markdown code examples. Keep answers direct and practical."
                }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
              }
            })
          });

          if (response.ok) {
            activeGeminiModel = model;
            localStorage.setItem("preferred_gemini_model", model);
            updateModelBadge(model);
            break;
          }

          const errJson = await response.clone().json().catch(() => ({}));
          lastErrMsg = errJson.error?.message || `HTTP ${response.status}`;

          // If 404 (model not found on this API version/project), continue to next candidate
          if (response.status === 404) {
            continue;
          }

          // If 400 with systemInstruction issue, retry without systemInstruction
          if (response.status === 400 && lastErrMsg.toLowerCase().includes("systeminstruction")) {
            const fallbackContents = [
              ...contentsPayload.slice(0, -1),
              {
                role: "user",
                parts: [{ text: "System Instruction: You are an expert AI Coding Tutor for Python and React.\n\n" + contextPrompt }]
              }
            ];
            response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: fallbackContents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
              })
            });
            if (response.ok) {
              activeGeminiModel = model;
              localStorage.setItem("preferred_gemini_model", model);
              updateModelBadge(model);
              break;
            }
          }

          // Hard error (e.g. invalid key, quota), break out
          break;
        } catch (fetchErr) {
          lastErrMsg = fetchErr.message || String(fetchErr);
        }
      }

      // Remove typing bubble
      const typingEl = document.getElementById(typingBubbleId);
      if (typingEl) typingEl.remove();

      if (!response || !response.ok) {
        let errMsg = lastErrMsg;
        if (response) {
          const errorData = await response.json().catch(() => ({}));
          errMsg = errorData.error && errorData.error.message ? errorData.error.message : (lastErrMsg || `HTTP Error ${response.status}`);
        }
        
        if (response && (response.status === 400 || response.status === 403)) {
          appendChatMessage(
            "bot",
            `❌ <strong>API Key Error:</strong> ${escapeHtml(errMsg)}<br><br>ദയവായി നിങ്ങളുടെ Google AI Studio API key പരിശോധിക്കുക. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:var(--accent-cyan); text-decoration:underline;">aistudio.google.com</a> വഴി പുതിയ key നേടാവുന്നതാണ്.`
          );
          toggleAiKeyBox(true);
        } else {
          appendChatMessage("bot", `⚠️ <strong>Error from Gemini API:</strong> ${escapeHtml(errMsg || "Connection failed")}`);
        }
        return;
      }

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botReply) {
        // Save to conversational memory
        aiConversationHistory.push({ role: "user", text: rawInput });
        aiConversationHistory.push({ role: "model", text: botReply });

        appendChatMessage("bot", formatAiResponse(botReply));
      } else {
        appendChatMessage("bot", "ഹലോ, എനിക്ക് ഉത്തരം ലഭിച്ചില്ല. ദയവായി ചോദ്യം വീണ്ടും ചോദിക്കാമോ?");
      }
    } catch (err) {
      const typingEl = document.getElementById(typingBubbleId);
      if (typingEl) typingEl.remove();

      appendChatMessage(
        "bot",
        `⚠️ <strong>Network or Connection Error:</strong> ${escapeHtml(err.message || String(err))}<br>ദയവായി നിങ്ങളുടെ ഇൻ്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.`
      );
    } finally {
      isAiGenerating = false;
      if (aiSendBtn) aiSendBtn.disabled = false;
    }
  }

  function appendChatMessage(sender, htmlContent) {
    if (!aiMessagesEl) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ${sender}`;
    msgDiv.innerHTML = `
      <div class="ai-avatar">${sender === "user" ? "👤" : "✨"}</div>
      <div class="ai-bubble">${htmlContent}</div>
    `;
    aiMessagesEl.appendChild(msgDiv);
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
  }

  function initAiAssistant() {
    updateAiKeyStatus();
    updateAiContextChip();

    // If key not yet stored, leave key box open on first load
    if (!getGeminiApiKey()) {
      toggleAiKeyBox(true);
    } else {
      toggleAiKeyBox(false);
    }

    if (headerAiBtn) {
      headerAiBtn.addEventListener("click", openAiDrawer);
    }

    if (aiFab) {
      aiFab.addEventListener("click", openAiDrawer);
    }

    if (closeAiDrawerBtn) {
      closeAiDrawerBtn.addEventListener("click", closeAiDrawer);
    }

    if (aiSettingsBtn) {
      aiSettingsBtn.addEventListener("click", () => toggleAiKeyBox());
    }

    if (saveAiKeyBtn) {
      saveAiKeyBtn.addEventListener("click", saveGeminiApiKey);
    }

    if (aiKeyInput) {
      aiKeyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          saveGeminiApiKey();
        }
      });
    }

    if (aiSendBtn) {
      aiSendBtn.addEventListener("click", () => sendAiMessage());
    }

    if (aiUserInput) {
      aiUserInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendAiMessage();
        }
      });

      // Auto expand height
      aiUserInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 120) + "px";
      });
    }

    // Quick suggestion prompt chips
    if (aiSuggestionsEl) {
      aiSuggestionsEl.addEventListener("click", (e) => {
        const chip = e.target.closest(".ai-sug-chip");
        if (chip) {
          const prompt = chip.getAttribute("data-prompt");
          if (prompt) {
            sendAiMessage(prompt);
          }
        }
      });
    }

    // Delegate code copy inside AI messages
    if (aiMessagesEl) {
      aiMessagesEl.addEventListener("click", (e) => {
        const copyBtn = e.target.closest(".ai-snippet-copy");
        if (copyBtn) {
          const preWrapper = copyBtn.closest(".ai-pre-wrapper");
          const codeEl = preWrapper ? preWrapper.querySelector("code") : null;
          if (codeEl) {
            copyToClipboard(codeEl.textContent, copyBtn);
          }
        }
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && aiDrawer && aiDrawer.classList.contains("open")) {
        closeAiDrawer();
      }
    });
  }

  // Start App
  document.addEventListener("DOMContentLoaded", init);
})();
