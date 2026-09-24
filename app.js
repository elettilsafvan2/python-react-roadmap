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
  const STORAGE_FILES_KEY = "fullstack_user_files_v1";

  // STATE
  let completedDays = new Set(JSON.parse(localStorage.getItem(STORAGE_COMPLETED_KEY) || "[]"));
  let userNotes = JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY) || "{}");
  let quizScores = JSON.parse(localStorage.getItem(STORAGE_QUIZ_KEY) || "{}");
  let completedSubtasks = JSON.parse(localStorage.getItem(STORAGE_SUBTASKS_KEY) || "{}");
  let userFiles = JSON.parse(localStorage.getItem(STORAGE_FILES_KEY) || "{}");
  let currentPhase = 0; // 0 = All
  let currentFilter = "all"; // 'all' | 'pending' | 'completed'
  let searchQuery = "";
  let currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || "dark";

  // MULTI-FILE WORKSPACE HELPERS
  function saveUserFiles() {
    localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify(userFiles));
    debouncedSyncToSupabase();
  }

  function getDayFiles(dayId, item) {
    const isPython = (item && item.codeLanguage ? item.codeLanguage : "").toLowerCase().includes("python");
    const defaultName = isPython ? "main.py" : "App.jsx";
    const defaultCode = (item && item.code) ? item.code : "";

    if (!userFiles[dayId] || !Array.isArray(userFiles[dayId]) || userFiles[dayId].length === 0) {
      userFiles[dayId] = [
        { name: defaultName, code: defaultCode, active: true }
      ];
      saveUserFiles();
    } else if (userFiles[dayId][0] && userFiles[dayId][0].name === defaultName && typeof userFiles[dayId][0].code === "string") {
      // Auto-migrate legacy Malayalam code prompts if user hasn't edited from old default
      if (userFiles[dayId][0].code.includes("നിങ്ങളുടെ പേര് എന്താണ്?") || userFiles[dayId][0].code.includes("നിങ്ങളുടെ മാർക്ക് നൽകുക")) {
        userFiles[dayId][0].code = defaultCode;
        saveUserFiles();
      }
    }

    let hasActive = false;
    userFiles[dayId].forEach((f) => {
      if (f.active) {
        if (hasActive) f.active = false;
        else hasActive = true;
      }
    });
    if (!hasActive && userFiles[dayId].length > 0) {
      userFiles[dayId][0].active = true;
      saveUserFiles();
    }
    return userFiles[dayId];
  }

  function getActiveFile(dayId, item) {
    const files = getDayFiles(dayId, item);
    return files.find((f) => f.active) || files[0];
  }

  function getFileIconSvg(filename) {
    const ext = (filename.split(".").pop() || "").toLowerCase();
    if (ext === "py") {
      return `<svg width="14" height="14" viewBox="0 0 128 128" style="vertical-align:text-bottom; margin-right:4px;">
        <path fill="#387eb8" d="M63.02 0c-16.88 0-31.54 2.87-31.54 18.42v13.82h32.14v4.61H20.73C5.07 36.85 0 47.96 0 63.63c0 15.68 8.7 25.1 23.95 25.1h9.21V75.64c0-7.39 6.45-13.82 13.82-13.82h31.94c7.38 0 13.82-6.43 13.82-13.82V18.42C92.74 3.79 79.9 0 63.02 0zm-12.2 9.21c2.54 0 4.61 2.07 4.61 4.61s-2.07 4.61-4.61 4.61-4.61-2.07-4.61-4.61 2.07-4.61 4.61-4.61z"/>
        <path fill="#ffe052" d="M64.98 128c16.88 0 31.54-2.87 31.54-18.42V95.76H64.38v-4.61h42.89c15.66 0 20.73-11.11 20.73-26.78 0-15.68-8.7-25.1-23.95-25.1h-9.21v13.09c0 7.39-6.45 13.82-13.82 13.82H49.08c-7.38 0-13.82 6.43-13.82 13.82v29.58C35.26 124.21 48.1 128 64.98 128zm12.2-9.21c-2.54 0-4.61-2.07-4.61-4.61s2.07-4.61 4.61-4.61 4.61 2.07 4.61 4.61-2.07 4.61-4.61 4.61z"/>
      </svg>`;
    } else if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="#f7df1e" style="vertical-align:text-bottom; margin-right:4px;"><rect width="24" height="24" rx="3" fill="#f7df1e"/><path d="M12.5 17.5c.6.9 1.4 1.5 2.6 1.5 1.5 0 2.4-.7 2.4-2.3v-6.9h2v7c0 2.6-1.6 3.7-4.2 3.7-2.3 0-3.6-1.2-4.3-2.5l1.5-.5zm-6 0c.5.8 1.2 1.3 2.1 1.3 1.1 0 1.8-.6 1.8-1.5 0-1-.7-1.4-1.9-1.9-1.8-.8-2.9-1.7-2.9-3.4 0-1.9 1.5-3.3 3.8-3.3 1.6 0 2.8.6 3.5 1.8l-1.5 1c-.4-.7-.9-1-1.9-1-1 0-1.6.6-1.6 1.3 0 .8.6 1.1 1.7 1.6 2 .9 3.1 1.8 3.1 3.7 0 2.2-1.7 3.4-4 3.4-2.1 0-3.5-1-4.2-2.5l1.9-.9z" fill="#000000"/></svg>`;
    } else if (ext === "json") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
    } else if (ext === "css") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8" style="vertical-align:text-bottom; margin-right:4px;"><path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3zm14.8 5.6h-7.6l.2 2.3h7.2l-.6 6.3-4.6 1.4-4.6-1.4-.3-3.4h2.3l.1 1.7 2.5.7 2.5-.7.3-3H6.7L6 4.3h12l-.2 3.3z"/></svg>`;
    } else if (ext === "html") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ea580c" style="vertical-align:text-bottom; margin-right:4px;"><path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3zm14.7 6.4H8.7l.2 2.3h8.3l-.8 7.5-4.4 1.3-4.4-1.3-.3-3.3h2.3l.1 1.6 2.3.7 2.3-.7.4-4.1H6.5L5.7 4.2h12.3l-.3 4.2z"/></svg>`;
    } else if (ext === "sql") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom; margin-right:4px;"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`;
    }
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
  }

  function getFileLangBadge(filename) {
    const ext = (filename.split(".").pop() || "").toLowerCase();
    if (ext === "py") return "Python 3.12 (WASM)";
    if (ext === "js" || ext === "jsx") return "JavaScript JSX";
    if (ext === "json") return "JSON";
    if (ext === "html") return "HTML5";
    if (ext === "css") return "CSS3";
    if (ext === "sql") return "SQL";
    return "Plain Text";
  }

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
  const shortcutsBtn = document.getElementById("shortcuts-btn");
  const shortcutsModal = document.getElementById("shortcuts-modal");
  const closeShortcutsModal = document.getElementById("close-shortcuts-modal");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsModal = document.getElementById("close-settings-modal");
  const resetBtn = document.getElementById("reset-btn");
  const clearProgressBtn = document.getElementById("clear-progress-btn");
  const profileNameInput = document.getElementById("profile-name-input");
  const profileAvatarInput = document.getElementById("profile-avatar-input");
  const profileAvatarPreview = document.getElementById("profile-avatar-preview");
  const profileAvatarFallback = document.getElementById("profile-avatar-fallback");
  const btnRemoveAvatar = document.getElementById("btn-remove-avatar");
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const headerAvatarBadge = document.getElementById("header-avatar-badge");

  const STORAGE_PROFILE_KEY = "fullstack_user_profile";
  let userProfile = { name: "User", avatar: "" };

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
  const aiNewChatBtn = document.getElementById("ai-new-chat-btn");
  const aiHistoryBtn = document.getElementById("ai-history-btn");
  const aiHistoryPanel = document.getElementById("ai-history-panel");
  const aiHistoryList = document.getElementById("ai-history-list");
  const aiHistoryNewBtn = document.getElementById("ai-history-new-btn");

  const STORAGE_AI_SESSIONS_KEY = "fullstack_ai_chat_sessions";
  const STORAGE_ACTIVE_SESSION_KEY = "fullstack_ai_active_session_id";

  let aiSessions = [];
  let currentAiSessionId = null;
  let aiConversationHistory = [];
  let isAiGenerating = false;
  let aiAbortController = null;

  // SUPABASE CONFIGURATION
  const SUPABASE_URL = "https://gtjcynyvarlwzbnrabos.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0amN5bnl2YXJsd3pibnJhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMTY4MjgsImV4cCI6MjEwNTY5MjgyOH0.tHKutDalGg2Kzflo53mdypTRgOdyljyh5iL4oMbV59M";
  const SUPABASE_TABLE = "user_progress";
  const SUPABASE_SYLLABUS_TABLE = "syllabus";
  const USER_ID = "default_user";

  let activeQuizIndices = {};

  const cloudSyncBtn = document.getElementById("cloud-sync-btn");
  const cloudIndicator = document.getElementById("cloud-indicator");
  const cloudStatusText = document.getElementById("cloud-status-text");

  function setCloudStatus(status, text) {
    if (!cloudIndicator) return;
    cloudIndicator.className = `cloud-indicator ${status}`;
    if (cloudStatusText) cloudStatusText.textContent = text;
    if (cloudSyncBtn) {
      if (status === "paused") {
        cloudSyncBtn.title = "Supabase Project Paused (Click to retry)";
      } else if (status === "online") {
        cloudSyncBtn.title = "Cloud Sync: Online (Supabase connected)";
      } else if (status === "syncing") {
        cloudSyncBtn.title = "Cloud Sync: Syncing...";
      } else {
        cloudSyncBtn.title = `Cloud Sync: ${text} (Local cache active)`;
      }
    }
  }

  // FETCH FULL SYLLABUS FROM SUPABASE CLOUD (With offline fallback)
  async function fetchSupabaseSyllabus() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_SYLLABUS_TABLE}?order=day.asc`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((row) => ({
          id: row.id,
          day: row.day,
          phase: row.phase,
          phaseTitle: row.phase_title || (row.phase === 1 ? "Phase 1: Python Basics & Backend" : row.phase === 2 ? "Phase 2: React & Frontend" : "Phase 3: Fullstack Capstone"),
          week: row.week || `Week ${Math.ceil(row.day / 7)}`,
          category: row.category || "General",
          title: row.title,
          summary: row.summary || "",
          details: row.details || "",
          code: row.code || "",
          codeLanguage: row.code_language || "python",
          task: row.task || "",
          tip: row.tip || "",
          resources: row.resources || "",
          quiz: row.quiz || null,
          quizzes: Array.isArray(row.quizzes) && row.quizzes.length > 0 ? row.quizzes : (row.quiz ? [row.quiz] : []),
          subtasks: Array.isArray(row.subtasks) ? row.subtasks : []
        }));

        if (mapped.length > 0) {
          SYLLABUS_DATA.length = 0;
          SYLLABUS_DATA.push(...mapped);
          renderSyllabus();
          updateProgressStats();
          if (currentOpenDayId) {
            openDayWorkspace(currentOpenDayId, false);
          }
        }
      }
    } catch (err) {
      console.warn("Using offline syllabus-data.js cache:", err);
    }
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

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        throw err;
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const cloudRecord = data[0];
        const cloudCompleted = Array.isArray(cloudRecord.completed_days) ? cloudRecord.completed_days : [];
        const cloudNotes = cloudRecord.notes && typeof cloudRecord.notes === "object" ? cloudRecord.notes : {};
        const cloudQuizzes = cloudRecord.quiz_scores && typeof cloudRecord.quiz_scores === "object" ? cloudRecord.quiz_scores : {};
        const cloudSubtasks = cloudRecord.completed_subtasks && typeof cloudRecord.completed_subtasks === "object" ? cloudRecord.completed_subtasks : {};
        const cloudFiles = cloudRecord.user_files && typeof cloudRecord.user_files === "object" ? cloudRecord.user_files : {};

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

        // Merge user files from Supabase
        Object.entries(cloudFiles).forEach(([dayId, filesArr]) => {
          if (Array.isArray(filesArr) && filesArr.length > 0) {
            if (!userFiles[dayId] || !Array.isArray(userFiles[dayId]) || userFiles[dayId].length === 0) {
              userFiles[dayId] = filesArr;
              changed = true;
            } else {
              filesArr.forEach((cf) => {
                const localF = userFiles[dayId].find((lf) => lf.name === cf.name);
                if (!localF) {
                  userFiles[dayId].push(cf);
                  changed = true;
                }
              });
            }
          }
        });

        if (changed) {
          localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(completedDays)));
          localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
          localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quizScores));
          localStorage.setItem(STORAGE_SUBTASKS_KEY, JSON.stringify(completedSubtasks));
          localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify(userFiles));
          renderSyllabus();
          updateProgressStats();
          if (currentOpenDayId) {
            const currentItem = SYLLABUS_DATA.find((d) => d.id === currentOpenDayId);
            if (currentItem) renderWorkspaceTabs(currentOpenDayId, currentItem);
          }
        } else {
          // If local has unique items or files not in cloud, sync local up
          const hasLocalUnique = Array.from(completedDays).some((d) => !cloudCompleted.includes(d));
          const hasLocalFiles = Object.keys(userFiles).length > 0 && Object.keys(cloudFiles).length === 0;
          if (hasLocalUnique || hasLocalFiles) {
            syncToSupabase();
          }
        }

        setCloudStatus("online", "Cloud Synced");
        if (isManual) showToast("Synced with Supabase Cloud!");
      } else {
        syncToSupabase();
      }
    } catch (err) {
      console.warn("Supabase fetch failed, operating in offline/localStorage mode:", err);
      const isPaused = (err && (err.status === 503 || err.status === 504 || (err.message && (err.message.includes("503") || err.message.includes("paused"))))) || false;
      if (isPaused) {
        setCloudStatus("paused", "Project Paused");
        if (isManual) showToast("Supabase project is paused. Please unpause in Supabase dashboard.");
      } else {
        setCloudStatus("offline", "Local Mode");
        if (isManual) showToast("Offline mode. Progress saved locally.");
      }
    }
  }

  // SYNC PROGRESS AND MULTI-FILES TO SUPABASE CLOUD
  async function syncToSupabase() {
    setCloudStatus("syncing", "Saving...");
    try {
      const payload = {
        id: USER_ID,
        completed_days: Array.from(completedDays),
        notes: userNotes,
        quiz_scores: quizScores,
        completed_subtasks: completedSubtasks,
        user_files: userFiles,
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

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        throw err;
      }
      setCloudStatus("online", "Cloud Synced");
    } catch (err) {
      console.warn("Supabase sync failed:", err);
      const isPaused = (err && (err.status === 503 || err.status === 504 || (err.message && (err.message.includes("503") || err.message.includes("paused"))))) || false;
      if (isPaused) {
        setCloudStatus("paused", "Project Paused");
      } else {
        setCloudStatus("offline", "Local Mode");
      }
    }
  }

  let syncTimer = null;
  function debouncedSyncToSupabase() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncToSupabase();
    }, 800);
  }

  // USER PROFILE MANAGEMENT (Name & Avatar photo)
  function loadUserProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          userProfile = { ...userProfile, ...parsed };
        }
      }
    } catch (e) {
      console.warn("Could not load user profile:", e);
    }
    updateProfileUI();
  }

  function saveUserProfile() {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.warn("Could not save user profile:", e);
    }
    updateProfileUI();
  }

  function updateProfileUI() {
    const initials = (userProfile.name || "U").trim().charAt(0).toUpperCase() || "U";

    // 1. Update Preview in Settings Modal
    if (profileAvatarPreview) {
      if (userProfile.avatar) {
        profileAvatarPreview.innerHTML = `<img src="${userProfile.avatar}" alt="Avatar" />`;
      } else {
        profileAvatarPreview.innerHTML = `<span>${escapeHtml(initials)}</span>`;
      }
    }
    if (btnRemoveAvatar) {
      btnRemoveAvatar.style.display = userProfile.avatar ? "inline-block" : "none";
    }

    // 2. Update Header Profile Button
    if (headerAvatarBadge) {
      if (userProfile.avatar) {
        headerAvatarBadge.innerHTML = `<img src="${userProfile.avatar}" alt="Avatar" />`;
      } else if (userProfile.name && userProfile.name !== "User") {
        headerAvatarBadge.innerHTML = `<span>${escapeHtml(initials)}</span>`;
      } else {
        headerAvatarBadge.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        `;
      }
    }

    // 3. Update User Avatars in AI Chat Bubbles
    document.querySelectorAll(".ai-msg.user .ai-avatar").forEach((el) => {
      el.innerHTML = getUserAvatarHtml();
      if (userProfile.avatar) {
        el.classList.add("has-custom-photo");
      } else {
        el.classList.remove("has-custom-photo");
      }
    });
  }

  function getUserAvatarHtml() {
    if (userProfile.avatar) {
      return `<img src="${userProfile.avatar}" alt="User Avatar" />`;
    }
    const initials = (userProfile.name || "U").trim().charAt(0).toUpperCase() || "U";
    if (userProfile.name && userProfile.name !== "User") {
      return `<span class="ai-avatar-initials">${escapeHtml(initials)}</span>`;
    }
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  }

  // INITIALIZATION
  function init() {
    loadUserProfile();
    applyTheme(currentTheme);
    renderSyllabus();
    updateProgressStats();
    attachEventListeners();
    attachGlobalKeyboardShortcuts();
    initAiAssistant();
    fetchSupabaseProgress(false);
    fetchSupabaseSyllabus();
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

  // CREATE ROADMAP CARD HTML (Clean pro overview with dot-bullet separation & uniform height)
  function createCardHtml(item) {
    const isDone = completedDays.has(item.id);
    const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
    const doneSubtasksCount = subtasks.filter((s) => !!completedSubtasks[s.id]).length;
    const savedQuiz = quizScores[item.id] || null;
    const isQuizCorrect = savedQuiz && savedQuiz.isCorrect;
    const dayStr = item.day < 10 ? `Day 0${item.day}` : `Day ${item.day}`;

    return `
      <article class="day-card ${isDone ? "completed" : ""}" id="card-${item.id}" data-id="${item.id}">
        <div class="day-card-row">
          <div class="custom-checkbox-wrap" onclick="event.stopPropagation();">
            <input 
              type="checkbox" 
              id="check-${item.id}" 
              class="card-checkbox" 
              data-id="${item.id}" 
              ${isDone ? "checked" : ""} 
              title="Mark as completed"
            />
            <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <div class="day-content-wrap" data-action="open-workspace" data-id="${item.id}">
            <div class="day-main-line">
              <span class="day-num-tag">${dayStr}</span>
              <span class="day-divider-dot" aria-hidden="true">•</span>
              <h3 class="day-title">${escapeHtml(item.title)}</h3>
              <span class="day-divider-dot" aria-hidden="true">•</span>
              <span class="day-category-tag">${escapeHtml(item.category)}</span>
            </div>

            <div class="day-sub-line">
              <span class="day-summary-text">${escapeHtml(item.summary)}</span>
              <span class="day-divider-dot" aria-hidden="true">•</span>
              <span class="day-stat-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                ${doneSubtasksCount}/${subtasks.length} Tasks
              </span>
              <span class="day-divider-dot" aria-hidden="true">•</span>
              <span class="day-stat-item ${isQuizCorrect ? 'quiz-won' : 'quiz-pending'}">
                ${isQuizCorrect 
                  ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Quiz Won' 
                  : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Quiz Pending'}
              </span>
            </div>
          </div>

          <div class="day-action-wrap" data-action="open-workspace" data-id="${item.id}">
            <span class="day-open-hint">Open</span>
            <svg class="day-chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
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
  function openDayWorkspace(dayId, updateHash = true, direction = 0) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item) return;

    currentOpenDayId = dayId;
    document.body.classList.add("in-workspace-mode");
    updateAiContextChip();
    const isDone = completedDays.has(item.id);
    const savedNote = userNotes[item.id] || "";
    const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
    const doneSubtasksCount = subtasks.filter((s) => !!completedSubtasks[s.id]).length;

    // Quizzes array with fallback to single quiz
    const quizzes = Array.isArray(item.quizzes) && item.quizzes.length > 0 ? item.quizzes : (item.quiz ? [item.quiz] : []);
    const currentQuizIdx = Math.min(activeQuizIndices[item.id] || 0, Math.max(0, quizzes.length - 1));
    activeQuizIndices[item.id] = currentQuizIdx;
    const activeQuiz = quizzes[currentQuizIdx] || null;
    const quizKey = `${item.id}_q${currentQuizIdx}`;
    const savedQuiz = quizScores[quizKey] || (currentQuizIdx === 0 ? quizScores[item.id] : null);
    const isQuizAnswered = !!savedQuiz;
    const isQuizCorrect = savedQuiz && savedQuiz.isCorrect;

    // Previous and Next Days
    const prevItem = SYLLABUS_DATA.find((d) => d.day === item.day - 1);
    const nextItem = SYLLABUS_DATA.find((d) => d.day === item.day + 1);

    // Multi-File Setup for this Day
    const dayFiles = getDayFiles(item.id, item);
    const activeFile = getActiveFile(item.id, item);
    const isPython = (item.codeLanguage || "").toLowerCase().includes("python");
    const currentFileName = activeFile ? activeFile.name : (isPython ? "main.py" : "App.jsx");
    const currentFileCode = activeFile ? activeFile.code : item.code;
    const langBadge = getFileLangBadge(currentFileName);

    const curriculumView = document.getElementById("curriculum-view");
    const workspaceView = document.getElementById("day-workspace-view");
    if (!workspaceView) return;

    if (curriculumView) curriculumView.style.display = "none";
    workspaceView.style.display = "flex";

    // Directional transition animation class
    workspaceView.classList.remove("slide-next", "slide-prev", "fade-in");
    void workspaceView.offsetWidth; // trigger reflow for smooth re-trigger
    if (direction > 0) {
      workspaceView.classList.add("slide-next");
    } else if (direction < 0) {
      workspaceView.classList.add("slide-prev");
    } else {
      workspaceView.classList.add("fade-in");
    }

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
            <span class="badge-category">${escapeHtml(item.category)}</span>
            <h2 class="workspace-title">${escapeHtml(item.title)}</h2>
          </div>
        </div>

        <div class="workspace-topbar-right">
          <!-- Unified Professional Day Stepper -->
          <div class="day-switcher-control" id="day-switcher-control">
            <button class="day-switcher-btn" id="btn-prev-day" ${prevItem ? "" : "disabled"} title="${prevItem ? `Go to Day ${prevItem.day} (${prevItem.title})` : 'First day'}" aria-label="Previous day">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="day-switcher-display" id="day-switcher-display" title="Day ${item.day} of ${SYLLABUS_DATA.length}">
              <span class="day-switcher-num">Day ${item.day}</span>
              <span class="day-switcher-total">/ ${SYLLABUS_DATA.length}</span>
            </div>
            <button class="day-switcher-btn" id="btn-next-day" ${nextItem ? "" : "disabled"} title="${nextItem ? `Go to Day ${nextItem.day} (${nextItem.title})` : 'Final day'}" aria-label="Next day">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <button class="workspace-complete-toggle ${isDone ? "completed" : ""}" id="btn-toggle-day-done">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${isDone ? "Done" : "Mark Done"}</span>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Core Concept &amp; Detailed Guide</span>
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

          <!-- Daily Concept Check Quiz (Multi-Quiz Support & AI Quiz Generation) -->
          ${quizzes.length > 0 ? `
            <div class="quiz-container" id="quiz-box-${item.id}">
              <div class="quiz-header">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span class="quiz-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Concept Check Quiz
                  </span>
                  <span class="quiz-score-pill" id="quiz-badge-${item.id}">
                    ${isQuizAnswered ? (isQuizCorrect ? "Won (+1 Pt)" : "Review &amp; Retry") : "+1 Knowledge Pt"}
                  </span>
                </div>

                <div class="quiz-header-right">
                  <div class="quiz-nav-group">
                    <button class="btn-quiz-nav" id="quiz-nav-prev-${item.id}" ${currentQuizIdx === 0 ? "disabled" : ""} title="Previous Quiz">‹</button>
                    <span id="quiz-page-label-${item.id}">${currentQuizIdx + 1} / ${quizzes.length}</span>
                    <button class="btn-quiz-nav" id="quiz-nav-next-${item.id}" ${currentQuizIdx >= quizzes.length - 1 ? "disabled" : ""} title="Next Quiz">›</button>
                  </div>
                  <button class="btn-ai-add-quiz" id="btn-ai-add-quiz-${item.id}" title="Generate and add a new quiz with AI">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>+ AI Quiz</span>
                  </button>
                </div>
              </div>
              <p class="quiz-question" id="quiz-question-text-${item.id}">${escapeHtml(activeQuiz ? activeQuiz.question : "")}</p>
              <div class="quiz-options" id="quiz-options-container-${item.id}">
                ${(activeQuiz ? activeQuiz.options : []).map((opt, oIdx) => {
                  const letters = ["A", "B", "C", "D"];
                  let optClass = "quiz-opt-btn";
                  let disabledAttr = "";
                  if (isQuizAnswered) {
                    if (oIdx === activeQuiz.correctIndex) optClass += " correct";
                    else if (oIdx === savedQuiz.answeredIndex && !isQuizCorrect) optClass += " wrong";
                    if (isQuizCorrect) disabledAttr = "disabled";
                  }
                  return `
                    <button class="${optClass}" data-day="${item.id}" data-opt="${oIdx}" data-qidx="${currentQuizIdx}" ${disabledAttr}>
                      <span class="quiz-letter">${letters[oIdx] || String.fromCharCode(65 + oIdx)}</span>
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
                  ${isQuizAnswered && isQuizCorrect 
                    ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Correct! Explanation:' 
                    : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Review Hint &amp; Explanation:'}
                </div>
                <div id="quiz-exp-content-${item.id}">${escapeHtml(activeQuiz ? activeQuiz.explanation : "")}</div>
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

        <!-- Right Pane: Real VS Code Experience with Multi-File Tabs -->
        <div class="workspace-right-pane">
          <div class="vscode-window">
            <!-- VS Code Tab Bar with Multiple Files -->
            <div class="vscode-tabs-bar">
              <div class="vscode-tabs-group" id="ws-tabs-group-${item.id}">
                ${dayFiles.map((f, idx) => `
                  <div class="vscode-tab ${f.active ? "active" : ""}" data-idx="${idx}" data-name="${escapeHtml(f.name)}" title="Double-click to rename">
                    <span class="tab-icon">${getFileIconSvg(f.name)}</span>
                    <span class="tab-title">${escapeHtml(f.name)}</span>
                    ${dayFiles.length > 1 ? `<span class="tab-close" data-close-idx="${idx}" title="Close file">×</span>` : ""}
                  </div>
                `).join("")}
                <button class="vscode-add-tab-btn" id="ws-add-tab-${item.id}" title="New File (+)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              <div class="vscode-actions-toolbar">
                <button class="vscode-btn-run" id="ws-run-btn-${item.id}" data-day="${item.id}" data-lang="${escapeHtml(item.codeLanguage)}" title="Run in Integrated Terminal (⌘↵)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Run</span>
                </button>
                <button class="vscode-icon-btn" id="ws-reset-btn-${item.id}" data-day="${item.id}" title="Reset Starter Code">
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
              <span class="crumb-file" id="ws-crumb-file-${item.id}">${escapeHtml(currentFileName)}</span>
            </div>

            <!-- Code Editor Body with Line Numbers Gutter & Syntax Highlight Overlay -->
            <div class="vscode-editor-body" id="editor-body-${item.id}">
              <div class="vscode-gutter" id="gutter-${item.id}"></div>
              <div class="vscode-code-container">
                <pre class="vscode-code-highlight" id="highlight-${item.id}" aria-hidden="true"><code></code></pre>
                <textarea 
                  class="vscode-code-area" 
                  id="editor-${item.id}" 
                  data-day="${item.id}" 
                  spellcheck="false"
                  autocapitalize="off"
                  autocomplete="off"
                >${escapeHtml(currentFileCode)}</textarea>
              </div>
            </div>

            <!-- VS Code Integrated Terminal Panel -->
            <div class="vscode-terminal-panel">
              <div class="terminal-panel-header">
                <div class="panel-tabs">
                  <span class="panel-tab active">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: text-top; margin-right: 4px;"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>TERMINAL
                  </span>
                </div>
                <div class="panel-controls">
                  <span class="term-shell-select">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                    1: zsh
                  </span>
                  <span class="term-status-pill" id="term-status-${item.id}">Ready</span>
                  <button class="vscode-icon-btn" id="ws-clear-btn-${item.id}" title="Clear Terminal / Kill Process (⌃C)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Terminal Screen & Interactive Input Stream -->
              <div class="vscode-terminal-screen" id="term-screen-${item.id}">
                <div class="term-log-stream" id="term-out-${item.id}"><span class="term-prompt-line"><span class="term-user">apple@macbook</span>:<span class="term-dir">~/fullstack-workspace</span>$ </span></div>
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
                <span class="status-item" id="status-lang-${item.id}">${langBadge}</span>
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
    document.body.classList.remove("in-workspace-mode");
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

  // FOCUS EDITOR HELPER (Seamless UX auto-focus for editing)
  function focusEditor(dayId, pos = 0) {
    requestAnimationFrame(() => {
      const editor = document.getElementById(`editor-${dayId}`);
      if (!editor) return;
      editor.focus();
      if (typeof pos === "number") {
        const targetPos = Math.min(pos, editor.value.length);
        editor.setSelectionRange(targetPos, targetPos);
      }
      const cursorStatus = document.getElementById(`status-cursor-${dayId}`);
      if (cursorStatus && pos === 0) {
        cursorStatus.textContent = "Ln 1, Col 1";
      }
    });
  }

  // RENDER MULTI-FILE TABS AND EVENT LISTENERS
  function renderWorkspaceTabs(dayId, item) {
    const tabsContainer = document.getElementById(`ws-tabs-group-${dayId}`);
    if (!tabsContainer) return;

    const dayFiles = getDayFiles(dayId, item);
    const activeFile = getActiveFile(dayId, item);

    tabsContainer.innerHTML = `
      ${dayFiles.map((f, idx) => `
        <div class="vscode-tab ${f.active ? "active" : ""}" data-idx="${idx}" data-name="${escapeHtml(f.name)}" title="Double-click to rename">
          <span class="tab-icon">${getFileIconSvg(f.name)}</span>
          <span class="tab-title">${escapeHtml(f.name)}</span>
          ${dayFiles.length > 1 ? `<span class="tab-close" data-close-idx="${idx}" title="Close file">×</span>` : ""}
        </div>
      `).join("")}
      <button class="vscode-add-tab-btn" id="ws-add-tab-${dayId}" title="New File (+)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    `;

    // Tab Click to Switch & Double Click to Inline Rename
    tabsContainer.querySelectorAll(".vscode-tab").forEach((tabEl) => {
      const idx = parseInt(tabEl.getAttribute("data-idx"), 10);
      const file = dayFiles[idx];
      let clickTimeout = null;

      const triggerRename = () => {
        if (tabEl.querySelector(".vscode-tab-input")) return;
        const titleSpan = tabEl.querySelector(".tab-title");
        if (!titleSpan) return;

        const currentName = file.name;
        tabEl.classList.add("editing");
        titleSpan.innerHTML = `<input type="text" class="vscode-tab-input" value="${escapeHtml(currentName)}" spellcheck="false" autocomplete="off" />`;
        const editInput = titleSpan.querySelector(".vscode-tab-input");
        if (!editInput) return;
        editInput.focus();

        const dotIdx = currentName.lastIndexOf(".");
        if (dotIdx > 0) editInput.setSelectionRange(0, dotIdx);
        else editInput.select();

        // Dynamically update icon if extension changed
        editInput.addEventListener("input", () => {
          const iconEl = tabEl.querySelector(".tab-icon");
          if (iconEl) iconEl.innerHTML = getFileIconSvg(editInput.value);
        });

        let renameCommitted = false;
        const commitRename = () => {
          if (renameCommitted) return;
          renameCommitted = true;
          const val = editInput.value.trim();
          if (!val || val === currentName) {
            renderWorkspaceTabs(dayId, item);
            focusEditor(dayId);
            return;
          }

          const exists = dayFiles.some((f, i) => i !== idx && f.name.toLowerCase() === val.toLowerCase());
          if (exists) {
            showToast(`A file named "${val}" already exists.`);
            renderWorkspaceTabs(dayId, item);
            focusEditor(dayId);
            return;
          }

          file.name = val;
          saveUserFiles();

          const crumb = document.getElementById(`ws-crumb-file-${dayId}`);
          if (crumb && file.active) crumb.textContent = val;

          const langBadge = document.getElementById(`status-lang-${dayId}`);
          if (langBadge && file.active) langBadge.textContent = getFileLangBadge(val);

          renderWorkspaceTabs(dayId, item);
          showToast(`Renamed to ${val}`);
          focusEditor(dayId);
        };

        editInput.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            commitRename();
          } else if (ev.key === "Escape") {
            ev.preventDefault();
            renameCommitted = true;
            renderWorkspaceTabs(dayId, item);
            focusEditor(dayId);
          }
        });

        editInput.addEventListener("blur", () => {
          setTimeout(() => {
            if (!renameCommitted) commitRename();
          }, 120);
        });
      };

      tabEl.addEventListener("click", (e) => {
        if (e.target.closest(".tab-close") || e.target.closest(".vscode-tab-input")) return;
        if (tabEl.classList.contains("editing")) return;

        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }

        // If double click was detected via detail count
        if (e.detail === 2) {
          triggerRename();
          return;
        }

        clickTimeout = setTimeout(() => {
          if (tabEl.classList.contains("editing")) return;
          if (file.active) {
            focusEditor(dayId);
            return;
          }

          const editor = document.getElementById(`editor-${dayId}`);
          if (editor) {
            const curActive = getActiveFile(dayId, item);
            if (curActive) curActive.code = editor.value;
          }

          dayFiles.forEach((f, i) => { f.active = (i === idx); });
          saveUserFiles();

          const newActive = dayFiles[idx];
          const editorEl = document.getElementById(`editor-${dayId}`);
          if (editorEl) {
            editorEl.value = newActive.code || "";
            editorEl.setSelectionRange(0, 0);
            const gutter = document.getElementById(`gutter-${dayId}`);
            if (gutter) {
              const lines = editorEl.value.split("\n").length;
              gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
            }
          }

          const crumb = document.getElementById(`ws-crumb-file-${dayId}`);
          if (crumb) crumb.textContent = newActive.name;

          const langBadge = document.getElementById(`status-lang-${dayId}`);
          if (langBadge) langBadge.textContent = getFileLangBadge(newActive.name);

          const cursorStatus = document.getElementById(`status-cursor-${dayId}`);
          if (cursorStatus) cursorStatus.textContent = "Ln 1, Col 1";

          if (typeof window[`_updateHighlight_${dayId}`] === "function") {
            window[`_updateHighlight_${dayId}`]();
          }

          renderWorkspaceTabs(dayId, item);
          focusEditor(dayId, 0);
        }, 180);
      });

      tabEl.addEventListener("dblclick", (e) => {
        if (e.target.closest(".tab-close")) return;
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
        triggerRename();
      });
    });

    // Close Tab buttons with Pro UI Confirmation
    tabsContainer.querySelectorAll(".tab-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const closeIdx = parseInt(closeBtn.getAttribute("data-close-idx"), 10);
        const fileToClose = dayFiles[closeIdx];
        if (!fileToClose) return;

        if (dayFiles.length <= 1) {
          showToast("Cannot close the only open file.");
          return;
        }

        showConfirmDialog({
          title: "Delete File",
          fileName: fileToClose.name,
          message: `Are you sure you want to permanently delete this file? It will be removed from your workspace and cloud storage.`,
          confirmText: "Delete File",
          isDanger: true
        }, () => {
          const wasActive = fileToClose.active;
          dayFiles.splice(closeIdx, 1);

          if (wasActive && dayFiles.length > 0) {
            const nextIdx = Math.min(closeIdx, dayFiles.length - 1);
            dayFiles[nextIdx].active = true;
            const newActive = dayFiles[nextIdx];
            const editorEl = document.getElementById(`editor-${dayId}`);
            if (editorEl) {
              editorEl.value = newActive.code || "";
              editorEl.setSelectionRange(0, 0);
              const gutter = document.getElementById(`gutter-${dayId}`);
              if (gutter) {
                const lines = editorEl.value.split("\n").length;
                gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
              }
            }
            const crumb = document.getElementById(`ws-crumb-file-${dayId}`);
            if (crumb) crumb.textContent = newActive.name;

            const langBadge = document.getElementById(`status-lang-${dayId}`);
            if (langBadge) langBadge.textContent = getFileLangBadge(newActive.name);

            const cursorStatus = document.getElementById(`status-cursor-${dayId}`);
            if (cursorStatus) cursorStatus.textContent = "Ln 1, Col 1";
          }
          if (typeof window[`_updateHighlight_${dayId}`] === "function") {
            window[`_updateHighlight_${dayId}`]();
          }

          saveUserFiles();
          renderWorkspaceTabs(dayId, item);
          showToast(`Deleted ${fileToClose.name}`);
        });
      });
    });

    // New File (+) button with direct inline typing in tab
    const addBtn = document.getElementById(`ws-add-tab-${dayId}`);
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        // Prevent duplicate draft tabs
        if (tabsContainer.querySelector(".vscode-tab-draft")) {
          const existingInput = tabsContainer.querySelector(".vscode-tab-input");
          if (existingInput) existingInput.focus();
          return;
        }

        const isPython = (item.codeLanguage || "").toLowerCase().includes("python");
        const ext = isPython ? ".py" : ".jsx";
        const defaultSuggest = `script_${dayFiles.length + 1}${ext}`;

        // Save current active file code first
        const prevActiveIdx = dayFiles.findIndex((f) => f.active);
        const editor = document.getElementById(`editor-${dayId}`);
        const gutter = document.getElementById(`gutter-${dayId}`);
        const crumb = document.getElementById(`ws-crumb-file-${dayId}`);
        const langBadge = document.getElementById(`status-lang-${dayId}`);
        const cursorStatus = document.getElementById(`status-cursor-${dayId}`);

        if (editor && prevActiveIdx >= 0) {
          dayFiles[prevActiveIdx].code = editor.value;
          saveUserFiles();
        }

        // Deactivate all existing tabs visually so only the new draft tab is active
        tabsContainer.querySelectorAll(".vscode-tab").forEach((t) => t.classList.remove("active"));

        // Switch editor immediately to clean blank slate for the new file
        if (editor) {
          editor.value = "";
          editor.setSelectionRange(0, 0);
          if (gutter) gutter.innerHTML = "<div>1</div>";
        }
        if (crumb) crumb.textContent = defaultSuggest;
        if (langBadge) langBadge.textContent = getFileLangBadge(defaultSuggest);
        if (cursorStatus) cursorStatus.textContent = "Ln 1, Col 1";

        const draftTab = document.createElement("div");
        draftTab.className = "vscode-tab vscode-tab-draft editing active";
        draftTab.innerHTML = `
          <span class="tab-icon" id="draft-tab-icon-${dayId}">${getFileIconSvg(defaultSuggest)}</span>
          <input 
            type="text" 
            class="vscode-tab-input" 
            id="draft-tab-input-${dayId}" 
            value="${escapeHtml(defaultSuggest)}" 
            spellcheck="false" 
            autocomplete="off" 
          />
        `;
        tabsContainer.insertBefore(draftTab, addBtn);

        const draftInput = draftTab.querySelector(".vscode-tab-input");
        draftInput.focus();
        const dotIdx = defaultSuggest.lastIndexOf(".");
        if (dotIdx > 0) draftInput.setSelectionRange(0, dotIdx);
        else draftInput.select();

        // Live icon, breadcrumb, and language updates as user types filename
        draftInput.addEventListener("input", () => {
          const val = draftInput.value;
          const iconEl = draftTab.querySelector(".tab-icon");
          if (iconEl) iconEl.innerHTML = getFileIconSvg(val);
          if (crumb) crumb.textContent = val || "untitled";
          if (langBadge) langBadge.textContent = getFileLangBadge(val);
        });

        let committed = false;

        const cancelDraft = () => {
          if (committed) return;
          committed = true;
          draftTab.remove();
          // Restore previous active tab and file content in editor
          if (prevActiveIdx >= 0 && dayFiles[prevActiveIdx]) {
            dayFiles.forEach((f, i) => { f.active = (i === prevActiveIdx); });
            const restored = dayFiles[prevActiveIdx];
            if (editor) {
              editor.value = restored.code || "";
              editor.setSelectionRange(0, 0);
              if (gutter) {
                const lines = (restored.code || "").split("\n").length;
                gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
              }
            }
            if (crumb) crumb.textContent = restored.name;
            if (langBadge) langBadge.textContent = getFileLangBadge(restored.name);
            renderWorkspaceTabs(dayId, item);
            focusEditor(dayId, 0);
          }
        };

        const commitNewTab = () => {
          if (committed) return;
          committed = true;
          const rawVal = draftInput.value.trim();
          if (!rawVal) {
            cancelDraft();
            return;
          }

          let finalName = rawVal;
          if (!finalName.includes(".")) {
            finalName += ext;
          }

          const exists = dayFiles.some((f) => f.name.toLowerCase() === finalName.toLowerCase());
          if (exists) {
            showToast(`A file named "${finalName}" already exists.`);
            cancelDraft();
            return;
          }

          const currentCode = editor ? editor.value : "";

          dayFiles.forEach((f) => { f.active = false; });
          dayFiles.push({ name: finalName, code: currentCode, active: true });
          saveUserFiles();

          if (crumb) crumb.textContent = finalName;
          if (langBadge) langBadge.textContent = getFileLangBadge(finalName);
          if (cursorStatus) cursorStatus.textContent = "Ln 1, Col 1";

          renderWorkspaceTabs(dayId, item);
          showToast(`Created ${finalName}`);
          focusEditor(dayId, 0);
        };

        draftInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitNewTab();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancelDraft();
          }
        });

        draftInput.addEventListener("blur", () => {
          setTimeout(() => {
            if (!committed) commitNewTab();
          }, 120);
        });
      });
    }
  }

  // ATTACH WORKSPACE LISTENERS FOR THE ACTIVE DAY
  function attachWorkspaceListeners(item) {
    const dayId = item.id;

    // Back to Roadmap button
    const backBtn = document.getElementById("btn-back-curriculum");
    if (backBtn) {
      backBtn.addEventListener("click", () => closeDayWorkspace(true));
    }

    // Prev / Next Day navigation (Unified Stepper)
    const prevBtn = document.getElementById("btn-prev-day");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const prevItem = SYLLABUS_DATA.find((d) => d.day === item.day - 1);
        if (prevItem) openDayWorkspace(prevItem.id, true, -1);
      });
    }

    const nextBtn = document.getElementById("btn-next-day");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nextItem = SYLLABUS_DATA.find((d) => d.day === item.day + 1);
        if (nextItem) openDayWorkspace(nextItem.id, true, 1);
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
        completeToggleBtn.querySelector("span").textContent = newDone ? "Done" : "Mark Done";
      });
    }

    // Multi-File Tabs setup
    renderWorkspaceTabs(dayId, item);

    // Gutter Line Numbers calculation & scroll sync
    const editor = document.getElementById(`editor-${dayId}`);
    const gutter = document.getElementById(`gutter-${dayId}`);
    const cursorStatus = document.getElementById(`status-cursor-${dayId}`);

    // Syntax Highlighter Engine (VS Code Dark Modern Theme)
    const highlightPre = document.getElementById(`highlight-${dayId}`);

    function escapeSyntaxHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function highlightSyntax(code, lang) {
      if (!code) return "";
      const isPy = (lang || "").toLowerCase().includes("python");

      // Python Keywords & Builtins
      const pyKeywords = new Set([
        "def", "class", "return", "if", "elif", "else", "for", "while", "break",
        "continue", "import", "from", "as", "try", "except", "finally", "with",
        "in", "is", "not", "and", "or", "lambda", "pass", "raise", "yield",
        "global", "nonlocal", "assert", "del", "async", "await"
      ]);
      const pyBuiltins = new Set([
        "print", "len", "range", "input", "int", "float", "str", "bool", "list",
        "dict", "set", "tuple", "enumerate", "zip", "sum", "min", "max", "open",
        "type", "isinstance", "help", "id", "dir", "round", "abs", "any", "all"
      ]);
      const pyConstants = new Set(["True", "False", "None", "self"]);

      // JavaScript / React Keywords
      const jsKeywords = new Set([
        "const", "let", "var", "function", "return", "if", "else", "for", "while",
        "break", "continue", "import", "export", "from", "default", "class",
        "extends", "try", "catch", "finally", "throw", "new", "typeof", "instanceof",
        "in", "of", "async", "await", "switch", "case", "yield"
      ]);
      const jsBuiltins = new Set([
        "console", "document", "window", "fetch", "setTimeout", "clearTimeout",
        "setInterval", "clearInterval", "JSON", "Math", "Array", "Object", "Promise",
        "useState", "useEffect", "useRef", "useMemo", "useCallback", "useContext"
      ]);
      const jsConstants = new Set(["true", "false", "null", "undefined", "NaN", "this"]);

      const keywords = isPy ? pyKeywords : jsKeywords;
      const builtins = isPy ? pyBuiltins : jsBuiltins;
      const constants = isPy ? pyConstants : jsConstants;

      // Regex token scanner
      const tokenRegex = isPy
        ? /("""[\s\S]*?"""|'''[\s\S]*?'''|#.*$|f"(?:\\.|[^"\\])*"|f'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b|[^\s\w])/gm
        : /(\/\*[\s\S]*?\*\/|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b|[^\s\w])/gm;

      let lastIndex = 0;
      let html = "";
      let match;

      while ((match = tokenRegex.exec(code)) !== null) {
        // Append raw leading spaces/tabs/newlines
        if (match.index > lastIndex) {
          html += escapeSyntaxHtml(code.substring(lastIndex, match.index));
        }
        lastIndex = tokenRegex.lastIndex;
        const token = match[0];

        // Comments
        if (token.startsWith("#") || token.startsWith("//") || token.startsWith("/*") || token.startsWith('"""') || token.startsWith("'''")) {
          html += `<span class="syn-comment">${escapeSyntaxHtml(token)}</span>`;
        }
        // Strings
        else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`") || token.startsWith('f"') || token.startsWith("f'")) {
          html += `<span class="syn-string">${escapeSyntaxHtml(token)}</span>`;
        }
        // Numbers
        else if (/^\d/.test(token)) {
          html += `<span class="syn-number">${escapeSyntaxHtml(token)}</span>`;
        }
        // Identifiers
        else if (/^[a-zA-Z_]/.test(token)) {
          // Check if followed by ( for function calls
          const nextCharMatch = code.substring(lastIndex).match(/^\s*\(/);
          if (keywords.has(token)) {
            html += `<span class="syn-keyword">${escapeSyntaxHtml(token)}</span>`;
          } else if (constants.has(token)) {
            html += `<span class="syn-constant">${escapeSyntaxHtml(token)}</span>`;
          } else if (builtins.has(token)) {
            html += `<span class="syn-builtin">${escapeSyntaxHtml(token)}</span>`;
          } else if (nextCharMatch) {
            html += `<span class="syn-function">${escapeSyntaxHtml(token)}</span>`;
          } else if (isPy && token.startsWith("__") && token.endsWith("__")) {
            html += `<span class="syn-builtin">${escapeSyntaxHtml(token)}</span>`;
          } else {
            html += `<span class="syn-variable">${escapeSyntaxHtml(token)}</span>`;
          }
        }
        // Operators & punctuation
        else {
          if (/[+\-*\/%=<>!&|^~]/.test(token)) {
            html += `<span class="syn-operator">${escapeSyntaxHtml(token)}</span>`;
          } else if (/[{}()\[\]]/.test(token)) {
            html += `<span class="syn-bracket">${escapeSyntaxHtml(token)}</span>`;
          } else {
            html += escapeSyntaxHtml(token);
          }
        }
      }

      if (lastIndex < code.length) {
        html += escapeSyntaxHtml(code.substring(lastIndex));
      }

      // Add trailing newline so scrolling matches exactly with textarea
      if (code.endsWith("\n")) {
        html += " ";
      }

      return html;
    }

    function updateHighlightOverlay() {
      if (!highlightPre || !editor) return;
      const codeEl = highlightPre.querySelector("code");
      if (!codeEl) return;
      const active = getActiveFile(dayId, item);
      const isPython = active ? active.name.endsWith(".py") : (item.codeLanguage || "").toLowerCase().includes("python");
      const lang = isPython ? "python" : "javascript";
      codeEl.innerHTML = highlightSyntax(editor.value, lang);
    }
    window[`_updateHighlight_${dayId}`] = updateHighlightOverlay;

    function syncEditorScroll() {
      if (!editor) return;
      if (gutter) gutter.scrollTop = editor.scrollTop;
      if (highlightPre) {
        highlightPre.scrollTop = editor.scrollTop;
        highlightPre.scrollLeft = editor.scrollLeft;
      }
    }

    function refreshGutter() {
      if (!editor || !gutter) return;
      const lines = editor.value.split("\n").length;
      gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
    }

    if (gutter) {
      gutter.addEventListener("click", (e) => {
        const lineDiv = e.target.closest("div");
        if (!lineDiv || !editor) return;
        const lineNum = parseInt(lineDiv.textContent, 10);
        if (isNaN(lineNum)) return;
        const lines = editor.value.split("\n");
        let charIndex = 0;
        for (let i = 0; i < lineNum - 1 && i < lines.length; i++) {
          charIndex += lines[i].length + 1;
        }
        editor.focus();
        editor.setSelectionRange(charIndex, charIndex);
        updateCursorPosition();
      });
    }

    if (editor) {
      refreshGutter();
      updateHighlightOverlay();
      syncEditorScroll();

      // Cursor position Ln X, Col Y tracker
      function updateCursorPosition() {
        if (!cursorStatus || !editor) return;
        const textToCursor = editor.value.substring(0, editor.selectionStart);
        const lines = textToCursor.split("\n");
        const ln = lines.length;
        const col = lines[lines.length - 1].length + 1;
        const selected = Math.abs(editor.selectionEnd - editor.selectionStart);
        if (selected > 0) {
          cursorStatus.textContent = `Ln ${ln}, Col ${col} (${selected} selected)`;
        } else {
          cursorStatus.textContent = `Ln ${ln}, Col ${col}`;
        }
      }

      // Initialize cursor position immediately
      updateCursorPosition();

      const scheduleCursorUpdate = () => {
        requestAnimationFrame(updateCursorPosition);
      };

      editor.addEventListener("input", () => {
        refreshGutter();
        updateHighlightOverlay();
        syncEditorScroll();
        updateCursorPosition();
        const active = getActiveFile(dayId, item);
        if (active) {
          active.code = editor.value;
          saveUserFiles();
        }
      });

      editor.addEventListener("scroll", syncEditorScroll);

      editor.addEventListener("keyup", updateCursorPosition);
      editor.addEventListener("keydown", scheduleCursorUpdate);
      editor.addEventListener("mousedown", scheduleCursorUpdate);
      editor.addEventListener("mouseup", updateCursorPosition);
      editor.addEventListener("click", updateCursorPosition);
      editor.addEventListener("focus", updateCursorPosition);
      editor.addEventListener("blur", updateCursorPosition);
      editor.addEventListener("select", updateCursorPosition);
      editor.addEventListener("pointerup", updateCursorPosition);

      const handleSelectionChange = () => {
        if (document.contains(editor) && (document.activeElement === editor || editor.matches(":focus"))) {
          updateCursorPosition();
        }
      };
      document.addEventListener("selectionchange", handleSelectionChange);

      // Helper: Toggle Line Comment (# or //)
      function toggleLineComment(textarea, lang) {
        const isPython = (lang || "").toLowerCase().includes("python");
        const prefix = isPython ? "# " : "// ";
        const rawPrefix = isPython ? "#" : "//";

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;

        const startLineIdx = val.substring(0, start).lastIndexOf("\n") + 1;
        let endLineIdx = val.indexOf("\n", end);
        if (endLineIdx === -1) endLineIdx = val.length;

        const linesBlock = val.substring(startLineIdx, endLineIdx);
        const lines = linesBlock.split("\n");

        const allCommented = lines.every((l) => l.trim().startsWith(rawPrefix));

        const newLines = lines.map((l) => {
          if (allCommented) {
            if (l.trim().startsWith(prefix)) return l.replace(prefix, "");
            if (l.trim().startsWith(rawPrefix)) return l.replace(rawPrefix, "");
            return l;
          } else {
            return prefix + l;
          }
        });

        const replacement = newLines.join("\n");
        textarea.value = val.substring(0, startLineIdx) + replacement + val.substring(endLineIdx);
        textarea.selectionStart = startLineIdx;
        textarea.selectionEnd = startLineIdx + replacement.length;
        refreshGutter();
        scheduleCursorUpdate();
        const active = getActiveFile(dayId, item);
        if (active) {
          active.code = textarea.value;
          saveUserFiles();
        }
      }

      function indentSelection(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start === end) {
          textarea.value = textarea.value.substring(0, start) + "    " + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        } else {
          const val = textarea.value;
          const startLineIdx = val.substring(0, start).lastIndexOf("\n") + 1;
          let endLineIdx = val.indexOf("\n", end);
          if (endLineIdx === -1) endLineIdx = val.length;
          const lines = val.substring(startLineIdx, endLineIdx).split("\n");
          const indented = lines.map((l) => "    " + l).join("\n");
          textarea.value = val.substring(0, startLineIdx) + indented + val.substring(endLineIdx);
          textarea.selectionStart = startLineIdx;
          textarea.selectionEnd = startLineIdx + indented.length;
        }
      }

      function outdentSelection(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        const startLineIdx = val.substring(0, start).lastIndexOf("\n") + 1;
        let endLineIdx = val.indexOf("\n", end);
        if (endLineIdx === -1) endLineIdx = val.length;
        const lines = val.substring(startLineIdx, endLineIdx).split("\n");
        const outdented = lines.map((l) => {
          if (l.startsWith("    ")) return l.substring(4);
          if (l.startsWith("\t")) return l.substring(1);
          return l.replace(/^\s{1,3}/, "");
        }).join("\n");
        textarea.value = val.substring(0, startLineIdx) + outdented + val.substring(endLineIdx);
        textarea.selectionStart = startLineIdx;
        textarea.selectionEnd = startLineIdx + outdented.length;
      }

      // Keyboard shortcuts inside editor
      editor.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "/") {
          e.preventDefault();
          const active = getActiveFile(dayId, item);
          const lang = active && active.name.endsWith(".py") ? "python" : (active ? "javascript" : item.codeLanguage);
          toggleLineComment(this, lang);
        } else if (e.key === "Tab") {
          // Tab Switching Shortcut inside editor: ⌃Tab or ⌥Tab
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            switchWorkspaceTab(dayId, e.shiftKey ? -1 : 1);
            return;
          }

          e.preventDefault();
          if (e.shiftKey) {
            outdentSelection(this);
          } else {
            indentSelection(this);
          }
          refreshGutter();
          scheduleCursorUpdate();
          const active = getActiveFile(dayId, item);
          if (active) {
            active.code = this.value;
            saveUserFiles();
          }
        } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          // Ctrl+Enter or Cmd+Enter to Run - stop propagation to avoid duplicate trigger from window keydown listener
          e.preventDefault();
          e.stopPropagation();
          const runBtn = document.getElementById(`ws-run-btn-${dayId}`);
          if (runBtn) runBtn.click();
        } else if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.altKey) {
          // Smart Enter Auto-indentation like VS Code
          const start = this.selectionStart;
          const end = this.selectionEnd;
          const val = this.value;
          const lineStart = val.substring(0, start).lastIndexOf("\n") + 1;
          const currentLine = val.substring(lineStart, start);
          const indentMatch = currentLine.match(/^\s*/);
          let indent = indentMatch ? indentMatch[0] : "";

          // If preceding char is open bracket/brace or colon, increase indent
          const prevChar = val.charAt(start - 1);
          const nextChar = val.charAt(end);
          const isPython = (item.codeLanguage || "").toLowerCase().includes("python");
          let extraIndent = "";
          let betweenPairs = false;

          if (prevChar === ":" || prevChar === "{" || prevChar === "(" || prevChar === "[") {
            extraIndent = "    ";
          }
          if ((prevChar === "{" && nextChar === "}") || 
              (prevChar === "(" && nextChar === ")") || 
              (prevChar === "[" && nextChar === "]")) {
            betweenPairs = true;
          }

          e.preventDefault();
          if (betweenPairs) {
            const insertText = "\n" + indent + "    \n" + indent;
            if (typeof this.setRangeText === "function") {
              this.setRangeText(insertText, start, end, "end");
              this.selectionStart = this.selectionEnd = start + indent.length + 5;
            } else {
              this.value = val.substring(0, start) + insertText + val.substring(end);
              this.selectionStart = this.selectionEnd = start + indent.length + 5;
            }
          } else {
            const insertText = "\n" + indent + extraIndent;
            if (typeof this.setRangeText === "function") {
              this.setRangeText(insertText, start, end, "end");
            } else {
              this.value = val.substring(0, start) + insertText + val.substring(end);
              this.selectionStart = this.selectionEnd = start + insertText.length;
            }
          }

          refreshGutter();
          updateHighlightOverlay();
          syncEditorScroll();
          scheduleCursorUpdate();
          const active = getActiveFile(dayId, item);
          if (active) {
            active.code = this.value;
            saveUserFiles();
          }
        } else if (e.key === "Backspace" && !e.metaKey && !e.ctrlKey && !e.altKey) {
          // Smart Backspace: Delete matching closing pair when empty between them
          const start = this.selectionStart;
          const end = this.selectionEnd;
          if (start === end && start > 0) {
            const prev = this.value.charAt(start - 1);
            const next = this.value.charAt(start);
            const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
            if (pairs[prev] && pairs[prev] === next) {
              e.preventDefault();
              if (typeof this.setRangeText === "function") {
                this.setRangeText("", start - 1, start + 1, "end");
              } else {
                this.value = this.value.substring(0, start - 1) + this.value.substring(start + 1);
                this.selectionStart = this.selectionEnd = start - 1;
              }
              refreshGutter();
              updateHighlightOverlay();
              syncEditorScroll();
              scheduleCursorUpdate();
              const active = getActiveFile(dayId, item);
              if (active) {
                active.code = this.value;
                saveUserFiles();
              }
            }
          }
        } else if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          // Auto-surround or Auto-close pairs like VS Code
          const surroundPairs = {
            '"': '"',
            "'": "'",
            "`": "`",
            "(": ")",
            "[": "]",
            "{": "}"
          };
          const closeChars = new Set([')', ']', '}', '"', "'", '`']);

          const start = this.selectionStart;
          const end = this.selectionEnd;
          const val = this.value;

          // If user types closing bracket or quote and it's already directly ahead of cursor, skip over it
          if (start === end && closeChars.has(e.key) && val.charAt(start) === e.key) {
            e.preventDefault();
            this.selectionStart = this.selectionEnd = start + 1;
            scheduleCursorUpdate();
            return;
          }

          if (surroundPairs[e.key] !== undefined) {
            const openChar = e.key;
            const closeChar = surroundPairs[e.key];

            if (start !== end) {
              // Wrap selection (Auto-surround) - keep only the inner text selected like VS Code
              e.preventDefault();
              const selectedText = val.substring(start, end);
              const wrappedText = openChar + selectedText + closeChar;
              if (typeof this.setRangeText === "function") {
                this.setRangeText(wrappedText, start, end, "end");
                this.selectionStart = start + openChar.length;
                this.selectionEnd = start + openChar.length + selectedText.length;
              } else {
                this.value = val.substring(0, start) + wrappedText + val.substring(end);
                this.selectionStart = start + openChar.length;
                this.selectionEnd = start + openChar.length + selectedText.length;
              }
            } else {
              // VS Code Real Flow:
              // For quotes (" or ' or `):
              // 1. If the character immediately before cursor is an alphanumeric word character or punctuation (e.g. print("Hello|)
              //    typing " should just insert a single closing quote ", NOT a pair!
              // 2. Also check if the current line already has an odd number of quotes (unclosed string) - in that case just close it with a single quote.
              const isQuote = (openChar === '"' || openChar === "'" || openChar === '`');
              const prevChar = start > 0 ? val.charAt(start - 1) : "";
              const nextChar = val.charAt(start);

              let shouldPair = true;

              if (isQuote) {
                // If preceded by a word char or backslash, user is closing or escaping, don't pair
                if (/[a-zA-Z0-9_\.]/.test(prevChar)) {
                  shouldPair = false;
                } else {
                  // Check current line quotes count before cursor
                  const lineStart = val.substring(0, start).lastIndexOf("\n") + 1;
                  const lineBeforeCursor = val.substring(lineStart, start);
                  let quoteCount = 0;
                  for (let i = 0; i < lineBeforeCursor.length; i++) {
                    if (lineBeforeCursor[i] === openChar && lineBeforeCursor[i - 1] !== "\\") {
                      quoteCount++;
                    }
                  }
                  // If odd number of quotes precede cursor, this quote closes the string
                  if (quoteCount % 2 === 1) {
                    shouldPair = false;
                  }
                }

                // If followed by a word character, don't auto-close either
                if (/[a-zA-Z0-9_]/.test(nextChar)) {
                  shouldPair = false;
                }
              }

              e.preventDefault();
              const insertText = shouldPair ? (openChar + closeChar) : openChar;
              if (typeof this.setRangeText === "function") {
                this.setRangeText(insertText, start, end, "end");
                this.selectionStart = this.selectionEnd = start + (shouldPair ? 1 : insertText.length);
              } else {
                this.value = val.substring(0, start) + insertText + val.substring(end);
                this.selectionStart = this.selectionEnd = start + (shouldPair ? 1 : insertText.length);
              }
            }

            refreshGutter();
            updateHighlightOverlay();
            syncEditorScroll();
            scheduleCursorUpdate();

            const active = getActiveFile(dayId, item);
            if (active) {
              active.code = this.value;
              saveUserFiles();
            }
          }
        }
      });
    }

    // Run Code Button
    const runBtn = document.getElementById(`ws-run-btn-${dayId}`);
    if (runBtn) {
      runBtn.addEventListener("click", function () {
        const active = getActiveFile(dayId, item);
        const code = editor ? editor.value : "";
        if (active) {
          active.code = code;
          saveUserFiles();
        }
        executeCodeRunner(dayId, item.codeLanguage, code, this);
      });
    }

    // Reset Starter Code
    const resetBtn = document.getElementById(`ws-reset-btn-${dayId}`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (editor) {
          const active = getActiveFile(dayId, item);
          const isPython = (item.codeLanguage || "").toLowerCase().includes("python");
          const defaultName = isPython ? "main.py" : "App.jsx";

          if (active && active.name === defaultName) {
            editor.value = item.code;
            active.code = item.code;
          } else if (active) {
            const starter = active.name.endsWith(".py")
              ? `# ${active.name}\n\ndef main():\n    print("Running ${active.name}")\n\nif __name__ == "__main__":\n    main()\n`
              : `// ${active.name}\n`;
            editor.value = starter;
            active.code = starter;
          }
          saveUserFiles();
          refreshGutter();
          if (typeof window[`_updateHighlight_${dayId}`] === "function") {
            window[`_updateHighlight_${dayId}`]();
          }
          showToast("Code reset to starter template.");
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

    // Clear & Kill Terminal Process Button (Trash icon)
    const clearBtn = document.getElementById(`ws-clear-btn-${dayId}`);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        // Kill active waiting input or running execution if any
        if (typeof window._killTerminalInput === "function") {
          window._killTerminalInput(dayId);
        }
        runningWorkspaces.delete(dayId);
        if (runBtn) {
          runBtn.classList.remove("running");
          runBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Run</span>
          `;
        }

        const out = document.getElementById(`term-out-${dayId}`);
        const status = document.getElementById(`term-status-${dayId}`);
        if (out) {
          out.innerHTML = `<span class="term-prompt-line"><span class="term-user">apple@macbook</span>:<span class="term-dir">~/fullstack-workspace</span>$ </span>`;
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

          // If all subtasks completed, mark the day as completed
          if (doneCount === item.subtasks.length && !completedDays.has(dayId)) {
            toggleDayCompletion(dayId, true);
            const completeToggle = document.getElementById("btn-toggle-day-done");
            if (completeToggle) {
              completeToggle.className = "workspace-complete-toggle completed";
              completeToggle.querySelector("span").textContent = "Done";
            }
            showToast("All daily tasks completed! Day marked as complete.");
          }
        }
      });
    });

    // Quiz Options Click
    const quizOptions = document.querySelectorAll(".quiz-opt-btn");
    quizOptions.forEach((btn) => {
      btn.addEventListener("click", function () {
        const optIdx = parseInt(this.getAttribute("data-opt"), 10);
        const qIdx = parseInt(this.getAttribute("data-qidx") || "0", 10);
        handleQuizAnswer(dayId, optIdx, qIdx);
      });
    });

    // Quiz Prev / Next Navigation
    const prevQuizBtn = document.getElementById(`quiz-nav-prev-${dayId}`);
    if (prevQuizBtn) {
      prevQuizBtn.addEventListener("click", () => {
        if ((activeQuizIndices[dayId] || 0) > 0) {
          activeQuizIndices[dayId]--;
          renderDayQuiz(item);
        }
      });
    }

    const nextQuizBtn = document.getElementById(`quiz-nav-next-${dayId}`);
    if (nextQuizBtn) {
      nextQuizBtn.addEventListener("click", () => {
        const qList = Array.isArray(item.quizzes) && item.quizzes.length > 0 ? item.quizzes : (item.quiz ? [item.quiz] : []);
        if ((activeQuizIndices[dayId] || 0) < qList.length - 1) {
          activeQuizIndices[dayId] = (activeQuizIndices[dayId] || 0) + 1;
          renderDayQuiz(item);
        }
      });
    }

    // AI Add Quiz button
    const addQuizBtn = document.getElementById(`btn-ai-add-quiz-${dayId}`);
    if (addQuizBtn) {
      addQuizBtn.addEventListener("click", () => {
        generateAndSaveAiQuiz(dayId);
      });
    }

    // Notes auto-save with debounce
    const notesArea = document.getElementById(`notes-${dayId}`);
    if (notesArea) {
      notesArea.addEventListener("input", debounce(function () {
        userNotes[dayId] = this.value;
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
        debouncedSyncToSupabase();
        
        const statusBadge = document.getElementById(`note-status-${dayId}`);
        if (statusBadge) {
          statusBadge.textContent = "Saved";
          setTimeout(() => {
            if (statusBadge) statusBadge.textContent = "Auto-saved";
          }, 1500);
        }
      }, 400));
    }

    // Auto-focus editor on opening the day workspace
    focusEditor(dayId, 0);
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
  let activeTerminalInputResolver = null;

  window._killTerminalInput = function (dayId) {
    if (activeTerminalInputResolver && activeTerminalInputResolver.dayId === dayId) {
      activeTerminalInputResolver.reject(new Error("KeyboardInterrupt"));
      activeTerminalInputResolver = null;
    }
    const row = document.getElementById(`term-row-${dayId}`);
    if (row) row.style.display = "none";
  };

  window._requestTerminalInput = function (dayId, promptText) {
    return new Promise((resolve, reject) => {
      const row = document.getElementById(`term-row-${dayId}`);
      const input = document.getElementById(`term-input-${dayId}`);
      const promptSpan = document.getElementById(`term-prompt-text-${dayId}`);
      const logStream = document.getElementById(`term-out-${dayId}`);
      const screen = document.getElementById(`term-screen-${dayId}`);
      const cancelBtn = document.getElementById(`term-cancel-btn-${dayId}`);

      if (!row || !input) {
        resolve("");
        return;
      }

      activeTerminalInputResolver = { dayId, resolve, reject };

      if (promptSpan) promptSpan.textContent = promptText || "";
      row.style.display = "flex";
      input.value = "";
      setTimeout(() => input.focus(), 30);
      if (screen) screen.scrollTop = screen.scrollHeight;

      const commit = () => {
        activeTerminalInputResolver = null;
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

      const interrupt = () => {
        row.style.display = "none";
        if (promptSpan) promptSpan.textContent = "";
        if (logStream) {
          const line = document.createElement("div");
          line.innerHTML = `<span class="term-prompt-prompt">${escapeHtml(promptText)}</span><span class="term-user-text">${escapeHtml(input.value)}</span><span style="color:#ef4444; font-weight:700; margin-left:6px;">^C</span>`;
          logStream.appendChild(line);
        }
        if (screen) screen.scrollTop = screen.scrollHeight;
        activeTerminalInputResolver = null;
        reject(new Error("KeyboardInterrupt"));
      };

      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
          e.preventDefault();
          interrupt();
        }
      };

      const enterHint = row.querySelector(".term-enter-hint");
      if (enterHint) {
        enterHint.onclick = () => commit();
      }

      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.preventDefault();
          interrupt();
        };
      }
    });
  };

  // RENDER DYNAMIC DAY QUIZ (Handles Quiz Prev/Next switching and updates)
  function renderDayQuiz(item) {
    const dayId = item.id;
    const quizzes = Array.isArray(item.quizzes) && item.quizzes.length > 0 ? item.quizzes : (item.quiz ? [item.quiz] : []);
    if (quizzes.length === 0) return;

    const currentIdx = Math.min(activeQuizIndices[dayId] || 0, quizzes.length - 1);
    activeQuizIndices[dayId] = currentIdx;
    const quiz = quizzes[currentIdx];
    const quizKey = `${dayId}_q${currentIdx}`;
    const savedQuiz = quizScores[quizKey] || (currentIdx === 0 ? quizScores[dayId] : null);
    const isQuizAnswered = !!savedQuiz;
    const isQuizCorrect = savedQuiz && savedQuiz.isCorrect;

    const questionEl = document.getElementById(`quiz-question-text-${dayId}`);
    if (questionEl) questionEl.textContent = quiz.question;

    const pageLabel = document.getElementById(`quiz-page-label-${dayId}`);
    if (pageLabel) pageLabel.textContent = `${currentIdx + 1} / ${quizzes.length}`;

    const prevBtn = document.getElementById(`quiz-nav-prev-${dayId}`);
    if (prevBtn) prevBtn.disabled = currentIdx === 0;

    const nextBtn = document.getElementById(`quiz-nav-next-${dayId}`);
    if (nextBtn) nextBtn.disabled = currentIdx >= quizzes.length - 1;

    const badge = document.getElementById(`quiz-badge-${dayId}`);
    if (badge) {
      badge.textContent = isQuizAnswered ? (isQuizCorrect ? "Won (+1 Pt)" : "Review & Retry") : "+1 Knowledge Pt";
    }

    const optionsContainer = document.getElementById(`quiz-options-container-${dayId}`);
    if (optionsContainer) {
      const letters = ["A", "B", "C", "D"];
      optionsContainer.innerHTML = quiz.options.map((opt, oIdx) => {
        let optClass = "quiz-opt-btn";
        let disabledAttr = "";
        if (isQuizAnswered) {
          if (oIdx === quiz.correctIndex) optClass += " correct";
          else if (oIdx === savedQuiz.answeredIndex && !isQuizCorrect) optClass += " wrong";
          if (isQuizCorrect) disabledAttr = "disabled";
        }
        return `
          <button class="${optClass}" data-day="${item.id}" data-opt="${oIdx}" data-qidx="${currentIdx}" ${disabledAttr}>
            <span class="quiz-letter">${letters[oIdx] || String.fromCharCode(65 + oIdx)}</span>
            <span class="quiz-opt-text">${escapeHtml(opt)}</span>
          </button>
        `;
      }).join("");

      optionsContainer.querySelectorAll(".quiz-opt-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const optIdx = parseInt(this.getAttribute("data-opt"), 10);
          const qIdx = parseInt(this.getAttribute("data-qidx"), 10);
          handleQuizAnswer(dayId, optIdx, qIdx);
        });
      });
    }

    const expEl = document.getElementById(`quiz-exp-${dayId}`);
    if (expEl) {
      if (isQuizAnswered) {
        expEl.style.display = "block";
        expEl.className = `quiz-explanation ${isQuizCorrect ? "correct-exp" : "wrong-exp"}`;
        expEl.innerHTML = `
          <div class="quiz-explanation-header">
            ${isQuizCorrect 
              ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Correct! Explanation:' 
              : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Review Hint &amp; Explanation:'}
          </div>
          <div>${escapeHtml(quiz.explanation)}</div>
        `;
      } else {
        expEl.style.display = "none";
      }
    }
  }

  // QUIZ ANSWER HANDLER (Supports multi-quiz indexing)
  function handleQuizAnswer(dayId, selectedIdx, quizIdx = 0) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item) return;

    const quizzes = Array.isArray(item.quizzes) && item.quizzes.length > 0 ? item.quizzes : (item.quiz ? [item.quiz] : []);
    const quiz = quizzes[quizIdx];
    if (!quiz) return;

    const isCorrect = selectedIdx === quiz.correctIndex;
    const quizKey = `${dayId}_q${quizIdx}`;
    quizScores[quizKey] = { answeredIndex: selectedIdx, isCorrect: isCorrect };
    if (quizIdx === 0) {
      quizScores[dayId] = quizScores[quizKey];
    }

    localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quizScores));
    debouncedSyncToSupabase();

    renderDayQuiz(item);
    updateQuizScoreStat();

    if (isCorrect) {
      showToast("Correct Answer! +1 Knowledge Point");
      fireCelebration("milestone");
    } else {
      showToast("Review the explanation and try again.");
    }
  }

  // GENERATE AND SAVE NEW QUIZ WITH GEMINI AI TUTOR TO SUPABASE
  async function generateAndSaveAiQuiz(dayId) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item) return;

    const apiKey = localStorage.getItem(STORAGE_GEMINI_KEY);
    if (!apiKey) {
      if (aiDrawer) aiDrawer.classList.add("open");
      if (aiKeyBox) aiKeyBox.style.display = "block";
      showToast("Please enter your Gemini API Key in the AI Tutor drawer.");
      return;
    }

    const addBtn = document.getElementById(`btn-ai-add-quiz-${dayId}`);
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Generating...</span>
      `;
    }

    try {
      const model = await resolveBestGeminiModel(apiKey);
      const apiVer = activeApiVersion || "v1beta";
      const apiUrl = `https://generativelanguage.googleapis.com/${apiVer}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const promptText = `You are an expert technical interviewer and computer science instructor in Python & React.
Create a new, highly practical multiple-choice quiz question for Day ${item.day}: "${item.title}".
Category: ${item.category}
Summary: ${item.summary}
Details: ${item.details}

Ensure the question tests deep understanding, real-world bug detection, or practical coding knowledge.
Provide exactly 4 distinct options (Option A, B, C, D) and a clear, instructive explanation.
Return ONLY valid JSON matching this schema with NO markdown code fences, NO backticks, and NO additional text:
{
  "question": "The question string",
  "options": ["Option A string", "Option B string", "Option C string", "Option D string"],
  "correctIndex": 0,
  "explanation": "Detailed explanation string"
}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }

      const resData = await res.json();
      const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedJson = candidateText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();
      const quizObj = JSON.parse(cleanedJson);

      if (!quizObj.question || !Array.isArray(quizObj.options) || quizObj.options.length < 2 || typeof quizObj.correctIndex !== "number") {
        throw new Error("Invalid quiz structure generated by AI");
      }

      if (!Array.isArray(item.quizzes)) {
        item.quizzes = item.quiz ? [item.quiz] : [];
      }
      item.quizzes.push(quizObj);
      activeQuizIndices[dayId] = item.quizzes.length - 1;

      // Persist to Supabase
      fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_SYLLABUS_TABLE}?id=eq.${dayId}`, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          quizzes: item.quizzes
        })
      }).catch((err) => console.warn("Could not patch quiz to Supabase:", err));

      showToast(`New AI Quiz added to Day ${item.day}!`);
      renderDayQuiz(item);
    } catch (err) {
      console.error("Failed to generate AI Quiz:", err);
      showToast(`AI Quiz generation error: ${err.message || "Unknown error"}`);
    } finally {
      if (addBtn) {
        addBtn.disabled = false;
        addBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>+ AI Quiz</span>
        `;
      }
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
      showToast("Initializing WebAssembly Python (WASM)...");
      pyodideInstance = await loadPyodide();
      return pyodideInstance;
    } finally {
      isPyodideLoading = false;
    }
  }

  // CODE EXECUTION DISPATCHER
  const runningWorkspaces = new Set();

  async function executeCodeRunner(dayId, lang, code, runBtn) {
    if (runningWorkspaces.has(dayId)) return;
    runningWorkspaces.add(dayId);

    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    const activeFile = getActiveFile(dayId, item);
    const activeName = activeFile ? activeFile.name : "main.py";
    const statusEl = document.getElementById(`term-status-${dayId}`);
    const logStream = document.getElementById(`term-out-${dayId}`);
    const screen = document.getElementById(`term-screen-${dayId}`);
    if (!statusEl) {
      runningWorkspaces.delete(dayId);
      return;
    }

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
    const isPython = activeName.endsWith(".py") || (lang || "").toLowerCase().includes("python");
    const cmdLine = isPython ? `python3 ${activeName}` : `node ${activeName}`;
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
      runningWorkspaces.delete(dayId);
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

      // Sync all files for this day into Pyodide virtual filesystem
      const item = SYLLABUS_DATA.find((d) => d.id === dayId);
      const dayFiles = getDayFiles(dayId, item);
      dayFiles.forEach((f) => {
        try {
          py.FS.writeFile(f.name, f.code);
        } catch (fsErr) {
          console.warn("Pyodide FS writeFile error:", f.name, fsErr);
        }
      });

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
      showToast("Module completed!");
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
        showToast("Congratulations! Full curriculum completed!");
      } else if (
        (previousPercentage < 25 && newPercentage >= 25) ||
        (previousPercentage < 50 && newPercentage >= 50) ||
        (previousPercentage < 75 && newPercentage >= 75)
      ) {
        fireCelebration("milestone");
        showToast(`Milestone reached: ${newPercentage}% completed!`);
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
        document.body.classList.add("modal-scroll-lock");
      });
    }

    if (closeCheatModal && cheatsheetModal) {
      closeCheatModal.addEventListener("click", () => {
        cheatsheetModal.classList.remove("open");
        if (!document.querySelector(".modal-overlay.open")) {
          document.body.classList.remove("modal-scroll-lock");
        }
      });

      cheatsheetModal.addEventListener("click", (e) => {
        if (e.target === cheatsheetModal) {
          cheatsheetModal.classList.remove("open");
          if (!document.querySelector(".modal-overlay.open")) {
            document.body.classList.remove("modal-scroll-lock");
          }
        }
      });
    }

    // Mac Keyboard Shortcuts Modal Open/Close
    if (shortcutsBtn && shortcutsModal) {
      shortcutsBtn.addEventListener("click", () => {
        toggleShortcutsModal(true);
      });
    }

    if (closeShortcutsModal && shortcutsModal) {
      closeShortcutsModal.addEventListener("click", () => {
        toggleShortcutsModal(false);
      });

      shortcutsModal.addEventListener("click", (e) => {
        if (e.target === shortcutsModal) {
          toggleShortcutsModal(false);
        }
      });
    }

    // Cloud Sync Button manual refresh
    if (cloudSyncBtn) {
      cloudSyncBtn.addEventListener("click", () => {
        fetchSupabaseProgress(true);
      });
    }

    // Settings & Profile Modal Open/Close
    function toggleSettingsModal(open) {
      if (!settingsModal) return;
      const shouldOpen = typeof open === "boolean" ? open : !settingsModal.classList.contains("open");
      if (shouldOpen) {
        settingsModal.classList.add("open");
        document.body.classList.add("modal-scroll-lock");
        if (profileNameInput) profileNameInput.value = userProfile.name || "";
      } else {
        settingsModal.classList.remove("open");
        if (!document.querySelector(".modal-overlay.open")) {
          document.body.classList.remove("modal-scroll-lock");
        }
      }
    }

    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        toggleSettingsModal(true);
      });
    }

    if (closeSettingsModal && settingsModal) {
      closeSettingsModal.addEventListener("click", () => {
        toggleSettingsModal(false);
      });

      settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) {
          toggleSettingsModal(false);
        }
      });
    }

    // Avatar Upload Handler
    if (profileAvatarInput) {
      profileAvatarInput.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          showToast("Please select a valid image file.");
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          showToast("Image size must be less than 2MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          userProfile.avatar = e.target.result;
          saveUserProfile();
          showToast("Profile photo updated!");
        };
        reader.readAsDataURL(file);
      });
    }

    // Remove Avatar Handler
    if (btnRemoveAvatar) {
      btnRemoveAvatar.addEventListener("click", () => {
        userProfile.avatar = "";
        saveUserProfile();
        showToast("Profile photo removed.");
      });
    }

    // Save Profile Details
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", () => {
        const nameVal = profileNameInput ? profileNameInput.value.trim() : "";
        userProfile.name = nameVal || "User";
        saveUserProfile();
        showToast("Profile saved successfully!");
        toggleSettingsModal(false);
      });
    }

    // Reset Progress (Accessible from inside Settings modal & legacy reset button)
    const handleResetCurriculum = () => {
      showConfirmDialog(
        {
          title: "Reset Curriculum Progress",
          message: "Are you sure you want to reset all your completed days, quiz scores, and saved notes? Your workspace files will remain intact.",
          confirmText: "Reset All",
          isDanger: true
        },
        () => {
          completedDays.clear();
          quizScores = {};
          completedSubtasks = {};
          localStorage.removeItem(STORAGE_COMPLETED_KEY);
          localStorage.removeItem(STORAGE_QUIZ_KEY);
          localStorage.removeItem(STORAGE_SUBTASKS_KEY);
          renderSyllabus();
          updateProgressStats();
          debouncedSyncToSupabase();
          toggleSettingsModal(false);
          showToast("Progress, quizzes, and tasks reset successfully.");
        }
      );
    };

    if (clearProgressBtn) {
      clearProgressBtn.addEventListener("click", handleResetCurriculum);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", handleResetCurriculum);
    }
  }

  // KEYBOARD SHORTCUTS MODAL TOGGLE HELPER
  function toggleShortcutsModal(open) {
    if (!shortcutsModal) return;
    const shouldOpen = typeof open === "boolean" ? open : !shortcutsModal.classList.contains("open");
    if (shouldOpen) {
      shortcutsModal.classList.add("open");
      document.body.classList.add("modal-scroll-lock");
    } else {
      shortcutsModal.classList.remove("open");
      if (!document.querySelector(".modal-overlay.open")) {
        document.body.classList.remove("modal-scroll-lock");
      }
    }
  }

  // WORKSPACE MULTI-TAB SWITCHER HELPER
  function switchWorkspaceTab(dayId, direction = 1) {
    const item = SYLLABUS_DATA.find((d) => d.id === dayId);
    if (!item) return;
    const dayFiles = getDayFiles(dayId, item);
    if (dayFiles.length <= 1) return;
    const curIdx = dayFiles.findIndex((f) => f.active);
    let nextIdx = (curIdx + direction + dayFiles.length) % dayFiles.length;

    // Save current code
    const editor = document.getElementById(`editor-${dayId}`);
    if (editor && curIdx >= 0) {
      dayFiles[curIdx].code = editor.value;
      saveUserFiles();
    }

    dayFiles.forEach((f, i) => { f.active = (i === nextIdx); });
    const newActive = dayFiles[nextIdx];
    if (editor) {
      editor.value = newActive.code || "";
      editor.setSelectionRange(0, 0);
      const gutter = document.getElementById(`gutter-${dayId}`);
      if (gutter) {
        const lines = editor.value.split("\n").length;
        gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
      }
    }
    const crumb = document.getElementById(`ws-crumb-file-${dayId}`);
    if (crumb) crumb.textContent = newActive.name;
    const langBadge = document.getElementById(`status-lang-${dayId}`);
    if (langBadge) langBadge.textContent = getFileLangBadge(newActive.name);
    const cursorStatus = document.getElementById(`status-cursor-${dayId}`);
    if (cursorStatus) cursorStatus.textContent = "Ln 1, Col 1";
    if (typeof window[`_updateHighlight_${dayId}`] === "function") {
      window[`_updateHighlight_${dayId}`]();
    }
    renderWorkspaceTabs(dayId, item);
    focusEditor(dayId, 0);
  }

  // GLOBAL MAC KEYBOARD SHORTCUTS LISTENER
  function attachGlobalKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      const confirmModal = document.getElementById("confirm-modal-overlay");
      const isEditingText = e.target.matches("textarea, input");

      // 1. ESCAPE KEY: Stop AI response, close active modal, AI drawer, or return to roadmap
      if (e.key === "Escape") {
        if (isAiGenerating) {
          stopAiGeneration();
          return;
        }
        if (confirmModal) return; // handled by confirm modal
        if (shortcutsModal && shortcutsModal.classList.contains("open")) {
          toggleShortcutsModal(false);
          return;
        }
        if (cheatsheetModal && cheatsheetModal.classList.contains("open")) {
          cheatsheetModal.classList.remove("open");
          if (!document.querySelector(".modal-overlay.open")) {
            document.body.classList.remove("modal-scroll-lock");
          }
          return;
        }
        if (aiDrawer && aiDrawer.classList.contains("open")) {
          closeAiDrawer();
          if (currentOpenDayId !== null) {
            focusEditor(currentOpenDayId);
          }
          return;
        }
        if (currentOpenDayId !== null && !document.querySelector(".vscode-tab-input")) {
          closeDayWorkspace(true);
          return;
        }
      }

      // 2. TOGGLE AI TUTOR: ⌘I or ⌥A (Universal, works everywhere)
      if (((e.metaKey || e.ctrlKey) && (e.code === "KeyI" || e.key.toLowerCase() === "i")) ||
          (e.altKey && (e.code === "KeyA" || e.key.toLowerCase() === "a" || e.key === "å"))) {
        e.preventDefault();
        toggleAiDrawer();
        return;
      }

      // 3. TOGGLE SHORTCUTS MODAL: ⌘/ (when not in editor) or ⌘. or ?
      if ((e.key === "?" && !isEditingText) || ((e.metaKey || e.ctrlKey) && e.key === ".")) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/" && !isEditingText) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // 4. TOGGLE THEME: ⌥T (e.code KeyT or special Mac unicode †)
      if (e.altKey && (e.code === "KeyT" || e.key.toLowerCase() === "t" || e.key === "†")) {
        e.preventDefault();
        if (themeToggleBtn) themeToggleBtn.click();
        return;
      }

      // 4. WORKSPACE-SPECIFIC SHORTCUTS (When a day workspace is open)
      if (currentOpenDayId !== null) {
        // Run Code: ⌘↵ or ⌃↵
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          const runBtn = document.getElementById(`ws-run-btn-${currentOpenDayId}`);
          if (runBtn) runBtn.click();
          return;
        }

        // Save Code & Cloud Sync: ⌘S
        if ((e.metaKey || e.ctrlKey) && (e.code === "KeyS" || e.key.toLowerCase() === "s")) {
          e.preventDefault();
          const editor = document.getElementById(`editor-${currentOpenDayId}`);
          const curItem = SYLLABUS_DATA.find((d) => d.id === currentOpenDayId);
          if (editor && curItem) {
            const activeFile = getActiveFile(currentOpenDayId, curItem);
            if (activeFile) {
              activeFile.code = editor.value;
              saveUserFiles();
              debouncedSyncToSupabase();
              showToast(`Saved & synced ${activeFile.name}`);
            }
          }
          return;
        }

        // Create New File: ⌥N or ⌘⌥N (e.code KeyN or Mac unicode ˜ / ~)
        if (e.altKey && (e.code === "KeyN" || e.key.toLowerCase() === "n" || e.key === "˜" || e.key === "~")) {
          e.preventDefault();
          const addTabBtn = document.getElementById(`ws-add-tab-${currentOpenDayId}`);
          if (addTabBtn) addTabBtn.click();
          return;
        }

        // Close / Delete Active File: ⌥W or ⌘⌥W (e.code KeyW or Mac unicode ∑)
        if (e.altKey && (e.code === "KeyW" || e.key.toLowerCase() === "w" || e.key === "∑")) {
          e.preventDefault();
          const activeCloseBtn = document.querySelector(`#ws-tabs-group-${currentOpenDayId} .vscode-tab.active .tab-close`);
          if (activeCloseBtn) {
            activeCloseBtn.click();
          } else {
            showToast("Cannot close the only open file.");
          }
          return;
        }

        // Clear Terminal: ⌘K or ⌘L
        if ((e.metaKey || e.ctrlKey) && (e.code === "KeyK" || e.code === "KeyL" || e.key.toLowerCase() === "k" || e.key.toLowerCase() === "l")) {
          e.preventDefault();
          const clearBtn = document.getElementById(`ws-clear-btn-${currentOpenDayId}`);
          if (clearBtn) clearBtn.click();
          return;
        }

        // Interrupt / Kill Terminal Process: ⌃C (Ctrl+C)
        if (e.ctrlKey && (e.code === "KeyC" || e.key.toLowerCase() === "c")) {
          if (activeTerminalInputResolver && activeTerminalInputResolver.dayId === currentOpenDayId) {
            e.preventDefault();
            window._killTerminalInput(currentOpenDayId);
            return;
          }
        }

        // Switch Tabs: ⌃Tab, ⌥Tab, or ⌘⌥[ / ⌘⌥]
        if ((e.ctrlKey || e.altKey) && e.key === "Tab") {
          e.preventDefault();
          switchWorkspaceTab(currentOpenDayId, e.shiftKey ? -1 : 1);
          return;
        }

        // Navigate Days with Keyboard: ⌥[ (Previous Day) and ⌥] (Next Day)
        if (e.altKey && (e.code === "BracketLeft" || e.key === "[" || e.key === "“")) {
          e.preventDefault();
          const prevBtn = document.getElementById("btn-prev-day");
          if (prevBtn && !prevBtn.disabled) prevBtn.click();
          return;
        }
        if (e.altKey && (e.code === "BracketRight" || e.key === "]" || e.key === "‘")) {
          e.preventDefault();
          const nextBtn = document.getElementById("btn-next-day");
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
          return;
        }
      }
    });
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
    btnElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!`;
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
    toast.innerHTML = `<span class="toast-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // PRO CONFIRMATION DIALOG MODAL (Replaces browser alert/confirm with IDE-grade UI)
  function showConfirmDialog(options, onConfirm, confirmTextFallback = "Confirm") {
    // Dismiss any existing confirm modal
    const existingModal = document.getElementById("confirm-modal-overlay");
    if (existingModal) existingModal.remove();

    let title = "Confirm Action";
    let message = "";
    let fileName = "";
    let isDanger = true;
    let confirmBtnText = confirmTextFallback;

    if (typeof options === "string") {
      message = options;
      if (message.toLowerCase().includes("delete")) {
        title = "Delete File";
        confirmBtnText = confirmTextFallback === "Confirm" ? "Delete File" : confirmTextFallback;
        isDanger = true;
      } else if (message.toLowerCase().includes("reset")) {
        title = "Reset Progress";
        confirmBtnText = confirmTextFallback === "Confirm" ? "Reset All" : confirmTextFallback;
        isDanger = true;
      }
    } else if (typeof options === "object" && options !== null) {
      title = options.title || title;
      message = options.message || "";
      fileName = options.fileName || "";
      isDanger = options.isDanger !== false;
      confirmBtnText = options.confirmText || confirmTextFallback;
    }

    const overlay = document.createElement("div");
    overlay.className = "confirm-modal-overlay";
    overlay.id = "confirm-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const iconSvg = isDanger
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    overlay.innerHTML = `
      <div class="confirm-modal-card">
        <div class="confirm-modal-top">
          <div class="confirm-icon-badge ${isDanger ? "danger" : "warning"}">
            ${iconSvg}
          </div>
          <div class="confirm-content">
            <h3 class="confirm-modal-title">${escapeHtml(title)}</h3>
            ${fileName ? `
              <div class="confirm-file-pill">
                <span class="confirm-file-icon">${getFileIconSvg(fileName)}</span>
                <span class="confirm-file-name">${escapeHtml(fileName)}</span>
              </div>
            ` : ""}
            <p class="confirm-modal-desc">${escapeHtml(message)}</p>
            <div class="confirm-modal-subhint">This action cannot be undone.</div>
          </div>
        </div>
        <div class="confirm-modal-actions">
          <button class="confirm-btn confirm-btn-cancel" id="confirm-modal-cancel">Cancel</button>
          <button class="confirm-btn confirm-btn-danger" id="confirm-modal-submit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            ${escapeHtml(confirmBtnText)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("modal-scroll-lock");

    const cancelBtn = overlay.querySelector("#confirm-modal-cancel");
    const submitBtn = overlay.querySelector("#confirm-modal-submit");

    const cleanup = () => {
      window.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      if (!document.querySelector(".modal-overlay.open")) {
        document.body.classList.remove("modal-scroll-lock");
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
      } else if (e.key === "Enter") {
        e.preventDefault();
        cleanup();
        if (typeof onConfirm === "function") onConfirm();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    cancelBtn.onclick = () => {
      cleanup();
    };

    submitBtn.onclick = () => {
      cleanup();
      if (typeof onConfirm === "function") onConfirm();
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cleanup();
      }
    };

    // Auto-focus the delete action button so pressing Enter executes confirmation immediately
    setTimeout(() => {
      if (submitBtn) submitBtn.focus();
    }, 50);
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
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash-lite"
  ];
  let activeGeminiModel = localStorage.getItem("preferred_gemini_model") || null;
  let activeApiVersion = localStorage.getItem("preferred_gemini_version") || "v1beta";

  function updateModelBadge(modelName) {
    const badge = document.getElementById("ai-model-label");
    if (badge && modelName) {
      // Clean display e.g. "gemini-3.6-flash" -> "Gemini 3.6 Flash"
      const clean = modelName.replace(/gemini-/i, "Gemini ").replace(/-/g, " ");
      badge.textContent = clean;
    }
  }

  async function resolveBestGeminiModel(apiKey) {
    if (activeGeminiModel) {
      updateModelBadge(activeGeminiModel);
      return activeGeminiModel;
    }

    try {
      for (const apiVer of ["v1beta", "v1"]) {
        const res = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models?key=${encodeURIComponent(apiKey)}`);
        if (res.ok) {
          const data = await res.json();
          const models = Array.isArray(data.models) ? data.models : [];
          const supported = models.filter((m) => {
            const methods = m.supportedGenerationMethods || [];
            return methods.includes("generateContent");
          });

          if (supported.length > 0) {
            // Find active 3.x flash or latest model, avoiding deprecated 2.5-flash / 1.5-flash
            const activeFlash = supported.find((m) => {
              const n = m.name || "";
              return (n.includes("3.6-flash") || n.includes("3.5-flash") || n.includes("3.8-flash") || n.includes("flash-latest") || n.includes("3.7-flash")) && !n.includes("tts") && !n.includes("image");
            });
            const fallbackFlash = supported.find((m) => m.name && m.name.includes("flash") && !m.name.includes("2.5-flash") && !m.name.includes("1.5-flash"));
            const any = activeFlash || fallbackFlash || supported.find((m) => m.name && m.name.includes("gemini")) || supported[0];
            const cleanName = any.name.replace(/^models\//, "");
            activeGeminiModel = cleanName;
            activeApiVersion = apiVer;
            localStorage.setItem("preferred_gemini_model", cleanName);
            localStorage.setItem("preferred_gemini_version", apiVer);
            updateModelBadge(cleanName);
            return cleanName;
          }
        }
      }
    } catch (e) {
      console.warn("Could not list Gemini models:", e);
    }

    return "gemini-3.6-flash";
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
        aiKeyStatus.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Key active (${escapeHtml(masked)})`;
      } else {
        aiKeyStatus.style.color = "var(--accent-amber)";
        aiKeyStatus.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>API Key not configured yet.`;
      }
    }
  }

  function toggleAiKeyBox(forceShow) {
    if (!aiKeyBox) return;
    const isCurrentlyHidden = window.getComputedStyle(aiKeyBox).display === "none";
    const show = typeof forceShow === "boolean" ? forceShow : isCurrentlyHidden;
    aiKeyBox.style.display = show ? "block" : "none";
    if (aiSettingsBtn) {
      if (show) {
        aiSettingsBtn.classList.add("active");
        if (typeof toggleAiHistoryPanel === "function") toggleAiHistoryPanel(false);
      } else {
        aiSettingsBtn.classList.remove("active");
      }
    }
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
      localStorage.setItem(STORAGE_GEMINI_KEY, val);
      localStorage.removeItem("preferred_gemini_model");
      activeGeminiModel = null;
      showToast("Google AI Studio Key saved!");
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
    document.body.classList.add("ai-drawer-open");
    if (headerAiBtn) headerAiBtn.classList.add("active");
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
    document.body.classList.remove("ai-drawer-open");
    if (headerAiBtn) headerAiBtn.classList.remove("active");
  }

  function toggleAiDrawer() {
    if (!aiDrawer) return;
    if (aiDrawer.classList.contains("open")) {
      closeAiDrawer();
      if (currentOpenDayId !== null) {
        focusEditor(currentOpenDayId);
      }
    } else {
      openAiDrawer();
    }
  }

  // AI DRAWER DRAGGABLE RESIZER
  function initAiDrawerResizer() {
    const resizer = document.getElementById("ai-drawer-resizer");
    if (!resizer || !aiDrawer) return;

    const STORAGE_DRAWER_WIDTH_KEY = "ai_drawer_width";
    const DEFAULT_WIDTH = 480;
    const MIN_WIDTH = 340;

    // Restore saved width from localStorage
    const savedWidth = parseInt(localStorage.getItem(STORAGE_DRAWER_WIDTH_KEY), 10);
    if (!isNaN(savedWidth) && savedWidth >= MIN_WIDTH) {
      document.documentElement.style.setProperty("--ai-drawer-width", `${savedWidth}px`);
    }

    let isDragging = false;
    let startX = 0;
    let startWidth = DEFAULT_WIDTH;

    const onPointerDown = (clientX) => {
      isDragging = true;
      startX = clientX;
      const currentWidthStr = getComputedStyle(document.documentElement).getPropertyValue("--ai-drawer-width");
      startWidth = parseInt(currentWidthStr, 10) || aiDrawer.offsetWidth || DEFAULT_WIDTH;
      document.body.classList.add("is-resizing-ai-drawer");
      resizer.classList.add("active");
    };

    const onPointerMove = (clientX) => {
      if (!isDragging) return;
      const deltaX = startX - clientX;
      const maxAllowedWidth = Math.max(MIN_WIDTH, window.innerWidth - 360);
      const newWidth = Math.min(Math.max(MIN_WIDTH, startWidth + deltaX), maxAllowedWidth);
      document.documentElement.style.setProperty("--ai-drawer-width", `${Math.round(newWidth)}px`);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      document.body.classList.remove("is-resizing-ai-drawer");
      resizer.classList.remove("active");
      const finalWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--ai-drawer-width"), 10);
      if (!isNaN(finalWidth)) {
        localStorage.setItem(STORAGE_DRAWER_WIDTH_KEY, finalWidth);
      }
    };

    // Mouse events
    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      onPointerDown(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (isDragging) onPointerMove(e.clientX);
    });

    window.addEventListener("mouseup", onPointerUp);

    // Touch events
    resizer.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length > 0) {
        onPointerDown(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (isDragging && e.touches && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener("touchend", onPointerUp);

    // Double-click resizer to reset to standard 480px width
    resizer.addEventListener("dblclick", () => {
      document.documentElement.style.setProperty("--ai-drawer-width", `${DEFAULT_WIDTH}px`);
      localStorage.setItem(STORAGE_DRAWER_WIDTH_KEY, DEFAULT_WIDTH);
      showToast("AI sidebar reset to standard 480px width.");
    });
  }

  function updateAiContextChip() {
    if (!aiContextChip) return;
    if (currentOpenDayId) {
      const item = SYLLABUS_DATA.find((d) => d.id === currentOpenDayId);
      if (item) {
        aiContextChip.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>Day ${item.day}: ${escapeHtml(item.title)}</span>`;
        aiContextChip.title = `Context active: Day ${item.day} - ${item.title} (${item.codeLanguage})`;
        return;
      }
    }
    aiContextChip.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg><span>General Roadmap Help</span>`;
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
        <div class="ai-pre-wrapper" style="margin:0.65rem 0; border-radius:6px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); background:#080c14; max-width:100%; width:100%; min-width:0; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.35rem 0.75rem; background:rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.72rem; color:var(--text-muted); font-family:var(--font-code);">
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="color:#38bdf8;">●</span> ${escapeHtml(langLabel)}</span>
            <button class="ai-snippet-copy btn-editor-subtle" style="padding:0.15rem 0.45rem; font-size:0.7rem; border-radius:4px;" title="Copy Code">Copy</button>
          </div>
          <pre style="margin:0; padding:0.75rem 0.95rem; overflow-x:auto; max-width:100%; box-sizing:border-box; background:transparent;"><code class="language-${escapeHtml(item.lang)}">${escapedCode}</code></pre>
        </div>
      `;
      text = text.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
    });

    return text;
  }

  function updateSendButtonState(generating) {
    if (!aiSendBtn) return;
    if (generating) {
      aiSendBtn.classList.add("stop-btn");
      aiSendBtn.setAttribute("aria-label", "Stop generating");
      aiSendBtn.title = "Stop generating (Pause)";
      aiSendBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="5" y="5" width="14" height="14" rx="2"></rect>
        </svg>
      `;
    } else {
      aiSendBtn.classList.remove("stop-btn");
      aiSendBtn.setAttribute("aria-label", "Send message");
      aiSendBtn.title = "Send message";
      aiSendBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
        </svg>
      `;
    }
  }

  function stopAiGeneration() {
    if (aiAbortController) {
      aiAbortController.abort();
      aiAbortController = null;
    }
    isAiGenerating = false;
    updateSendButtonState(false);
  }

  // =========================================================
  // AI CHAT SESSIONS & PERSISTENCE (GEMINI/CHATGPT STYLE)
  // =========================================================

  function loadAiSessionsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_AI_SESSIONS_KEY);
      aiSessions = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(aiSessions)) aiSessions = [];
    } catch (e) {
      aiSessions = [];
    }

    currentAiSessionId = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY) || null;
    const exists = aiSessions.some((s) => s.id === currentAiSessionId);
    if (!exists) {
      if (aiSessions.length > 0) {
        currentAiSessionId = aiSessions[0].id;
      } else {
        currentAiSessionId = null;
      }
    }
  }

  function saveAiSessionsToStorage() {
    try {
      localStorage.setItem(STORAGE_AI_SESSIONS_KEY, JSON.stringify(aiSessions));
      if (currentAiSessionId) {
        localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, currentAiSessionId);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_SESSION_KEY);
      }
    } catch (e) {
      console.warn("Could not save AI chat sessions to localStorage:", e);
    }
  }

  function getCurrentAiSession() {
    return aiSessions.find((s) => s.id === currentAiSessionId) || null;
  }

  function createNewAiSession(firstUserText = null) {
    const newId = "session_" + Date.now();
    const title = firstUserText
      ? (firstUserText.length > 32 ? firstUserText.slice(0, 32) + "..." : firstUserText)
      : "New Conversation";

    const defaultGreetingHtml = "ഹലോ! ഞാൻ നിങ്ങളുടെ <b>Fullstack AI Coding Tutor</b> (Google Gemini). Python, React, FastAPI, SQL സംശയങ്ങൾ ചോദിക്കാം. കോഡിലെ എററുകൾ ഫിക്സ് ചെയ്യാനും സഹായിക്കാം!";

    const newSession = {
      id: newId,
      title: title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { sender: "bot", html: defaultGreetingHtml }
      ],
      history: []
    };

    aiSessions.unshift(newSession);
    currentAiSessionId = newId;
    aiConversationHistory = [];
    saveAiSessionsToStorage();
    renderActiveSessionMessages();
    renderAiHistoryList();
    return newSession;
  }

  function renderActiveSessionMessages() {
    if (!aiMessagesEl) return;
    const session = getCurrentAiSession();
    if (!session || !session.messages || session.messages.length === 0) {
      aiMessagesEl.innerHTML = `
        <div class="ai-msg bot">
          <div class="ai-avatar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
          </div>
          <div class="ai-bubble">
            ഹലോ! ഞാൻ നിങ്ങളുടെ <b>Fullstack AI Coding Tutor</b> (Google Gemini). Python, React, FastAPI, SQL സംശയങ്ങൾ ചോദിക്കാം. കോഡിലെ എററുകൾ ഫിക്സ് ചെയ്യാനും സഹായിക്കാം!
          </div>
        </div>
      `;
      aiConversationHistory = [];
      return;
    }

    aiConversationHistory = Array.isArray(session.history) ? [...session.history] : [];

    let html = "";
    session.messages.forEach((m, idx) => {
      const avatarHtml = m.sender === "user"
        ? getUserAvatarHtml()
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
      const customPhotoClass = (m.sender === "user" && userProfile.avatar) ? " has-custom-photo" : "";

      const editBtnHtml = m.sender === "user"
        ? `<button type="button" class="ai-msg-edit-btn" data-msg-idx="${idx}" title="Edit question">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>`
        : "";

      html += `
        <div class="ai-msg ${m.sender}" data-msg-idx="${idx}">
          <div class="ai-avatar${customPhotoClass}">${avatarHtml}</div>
          <div class="ai-bubble">${m.html}${editBtnHtml}</div>
        </div>
      `;
    });

    aiMessagesEl.innerHTML = html;
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
  }

  function renderAiHistoryList() {
    if (!aiHistoryList) return;
    if (aiSessions.length === 0) {
      aiHistoryList.innerHTML = `<div class="ai-history-empty">മുൻപുള്ള സംഭാഷണങ്ങൾ ഒന്നും ലഭ്യമല്ല.</div>`;
      return;
    }

    let itemsHtml = "";
    aiSessions.forEach((s) => {
      const isActive = s.id === currentAiSessionId ? "active" : "";
      const date = new Date(s.updatedAt || s.createdAt);
      const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      itemsHtml += `
        <div class="ai-history-item ${isActive}" data-session-id="${s.id}">
          <div class="ai-history-item-content">
            <svg class="ai-history-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span class="ai-history-item-title" title="${escapeHtml(s.title || 'Chat')}">${escapeHtml(s.title || "Chat")}</span>
          </div>
          <span class="ai-history-item-time">${timeStr}</span>
          <button class="ai-history-item-del" data-del-id="${s.id}" title="Delete chat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
    });

    aiHistoryList.innerHTML = itemsHtml;
  }

  function toggleAiHistoryPanel(forceShow) {
    if (!aiHistoryPanel) return;
    const isCurrentlyHidden = window.getComputedStyle(aiHistoryPanel).display === "none";
    const show = typeof forceShow === "boolean" ? forceShow : isCurrentlyHidden;
    aiHistoryPanel.style.display = show ? "flex" : "none";
    if (show) {
      if (aiHistoryBtn) aiHistoryBtn.classList.add("active");
      if (typeof toggleAiKeyBox === "function") toggleAiKeyBox(false);
      renderAiHistoryList();
    } else {
      if (aiHistoryBtn) aiHistoryBtn.classList.remove("active");
    }
  }

  function switchAiSession(sessionId) {
    if (isAiGenerating) {
      stopAiGeneration();
    }
    currentAiSessionId = sessionId;
    saveAiSessionsToStorage();
    renderActiveSessionMessages();
    renderAiHistoryList();
    toggleAiHistoryPanel(false);
  }

  function deleteAiSession(sessionId, e) {
    if (e) e.stopPropagation();
    aiSessions = aiSessions.filter((s) => s.id !== sessionId);
    if (currentAiSessionId === sessionId) {
      currentAiSessionId = aiSessions.length > 0 ? aiSessions[0].id : null;
      renderActiveSessionMessages();
    }
    saveAiSessionsToStorage();
    renderAiHistoryList();
  }

  function appendChatMessage(sender, htmlContent, skipStorage = false) {
    if (!aiMessagesEl) return;
    const session = getCurrentAiSession();
    const idx = session && session.messages ? session.messages.length : 0;
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ${sender}`;
    msgDiv.setAttribute("data-msg-idx", idx);

    const avatarHtml = sender === "user"
      ? getUserAvatarHtml()
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
    const customPhotoClass = (sender === "user" && userProfile.avatar) ? " has-custom-photo" : "";

    const editBtnHtml = sender === "user"
      ? `<button type="button" class="ai-msg-edit-btn" data-msg-idx="${idx}" title="Edit question">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>`
      : "";

    msgDiv.innerHTML = `
      <div class="ai-avatar${customPhotoClass}">${avatarHtml}</div>
      <div class="ai-bubble">${htmlContent}${editBtnHtml}</div>
    `;
    aiMessagesEl.appendChild(msgDiv);
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;

    if (!skipStorage) {
      let session = getCurrentAiSession();
      if (!session) {
        session = createNewAiSession();
      }
      session.messages.push({ sender, html: htmlContent });
      session.updatedAt = Date.now();
      saveAiSessionsToStorage();
    }
  }

  // SEND AI MESSAGE
  async function sendAiMessage(promptText) {
    if (isAiGenerating) {
      stopAiGeneration();
      return;
    }

    const rawInput = (promptText !== undefined ? promptText : (aiUserInput ? aiUserInput.value : "")).trim();
    if (!rawInput) return;

    // Ensure session exists or create one named after the first question
    let session = getCurrentAiSession();
    if (!session) {
      session = createNewAiSession(rawInput);
    } else if (session.messages.length <= 1) {
      session.title = rawInput.length > 32 ? rawInput.slice(0, 32) + "..." : rawInput;
    }

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
        `<div style="display:flex; align-items:center; gap:6px; margin-bottom:8px; font-weight:700; color:var(--accent-amber);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Google AI Studio API Key ആവശ്യമാണ്
        </div>
        1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:var(--accent-cyan); text-decoration:underline;">aistudio.google.com/app/apikey</a> സന്ദർശിച്ച് സൗജന്യമായി (Free) ഒരു API key ഉണ്ടാക്കുക.<br>
        2. മുകളിലുള്ള API Key ബോക്സിൽ കീ പേസ്റ്റ് ചെയ്ത് <strong>Save</strong> ക്ലിക്ക് ചെയ്യുക.<br><br>
        തുടർന്ന് നിങ്ങളുടെ കോഡിംഗ് സംശയങ്ങൾ ചോദിക്കാം.`
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

    const trimmedInput = rawInput.trim();
    const isGreeting = /^(hi|hello|hey|hai|hlo|helo|vanakkam|namaskaram|namaste)[\s!.]*$/i.test(trimmedInput);

    if (isGreeting) {
      contextPrompt = trimmedInput;
    } else if (activeItem) {
      contextPrompt = `[REFERENCE CONTEXT (Day ${activeItem.day}: ${activeItem.title})]:
${includeCode && editorCode ? `Active Editor Code (${activeItem.codeLanguage}):\n\`\`\`${activeItem.codeLanguage}\n${editorCode}\n\`\`\`\n` : ""}
Student Question: ${rawInput}`;
    } else {
      contextPrompt = rawInput;
    }

    // Add Bot Typing Indicator
    const typingBubbleId = "ai-typing-" + Date.now();
    const loadingHtml = `
      <div class="ai-msg bot" id="${typingBubbleId}">
        <div class="ai-avatar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
        </div>
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
    aiAbortController = new AbortController();
    updateSendButtonState(true);

    const AI_SYSTEM_INSTRUCTION = `You are a concise, direct, and expert AI Coding Tutor for Python and React for a student in Kerala, India.

CRITICAL RULES YOU MUST STRICTLY FOLLOW:
1. EXTREMELY SHORT & DIRECT:
   - For simple greetings (such as "hi", "hello", "hey", "hai"): Reply in JUST ONE short sentence in Malayalam (e.g., "ഹലോ! എന്താണ് സംശയം?"). NEVER lecture, dump starter code, or explain lessons for greetings.
   - Answer ONLY what the student specifically asked. Do not add unsolicited background information, curriculum overviews, or tips.
   - Keep answers as short, concise, and focused as possible. Only expand if the student explicitly asks to explain in detail ("വിശദീകരിക്കാമോ" or "explain in detail").
2. ZERO EMOJIS:
   - Do NOT use any emojis anywhere in your response (no smileys, rockets, lightbulbs, celebrations, etc.). Keep formatting clean and professional.
3. LANGUAGE:
   - Reply in clean, natural Malayalam mixed with standard English technical terms (Variable, Function, String, Loop, Component, State, Terminal, etc.).
4. CODE EXAMPLES:
   - When code is needed, give only the minimal clean markdown snippet directly answering the question.`;

    try {
      // Build conversation contents (up to 8 past conversational turns for ongoing context memory)
      const contentsPayload = [];
      const historySlice = aiConversationHistory.slice(-8);
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
        if (!isAiGenerating || (aiAbortController && aiAbortController.signal.aborted)) {
          break;
        }

        usedModel = model;
        const apiVer = activeApiVersion || "v1beta";
        const apiUrl = `https://generativelanguage.googleapis.com/${apiVer}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            signal: aiAbortController ? aiAbortController.signal : undefined,
            body: JSON.stringify({
              contents: contentsPayload,
              systemInstruction: {
                parts: [{
                  text: AI_SYSTEM_INSTRUCTION
                }]
              },
              generationConfig: {
                temperature: 0.35,
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
                parts: [{ text: `${AI_SYSTEM_INSTRUCTION}\n\nStudent Message:\n${contextPrompt}` }]
              }
            ];
            response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: aiAbortController ? aiAbortController.signal : undefined,
              body: JSON.stringify({
                contents: fallbackContents,
                generationConfig: { temperature: 0.35, maxOutputTokens: 2048 }
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
          if (fetchErr.name === "AbortError" || (aiAbortController && aiAbortController.signal.aborted)) {
            break;
          }
          lastErrMsg = fetchErr.message || String(fetchErr);
        }
      }

      // Remove typing bubble
      const typingEl = document.getElementById(typingBubbleId);
      if (typingEl) typingEl.remove();

      if (aiAbortController && aiAbortController.signal.aborted) {
        appendChatMessage("bot", '<span style="color:var(--text-muted); font-size:0.85rem; font-style:italic;">മറുപടി നൽകുന്നത് നിർത്തിവെച്ചു (Stopped).</span>');
        return;
      }

      if (!response || !response.ok) {
        let errMsg = lastErrMsg;
        if (response) {
          const errorData = await response.json().catch(() => ({}));
          errMsg = errorData.error && errorData.error.message ? errorData.error.message : (lastErrMsg || `HTTP Error ${response.status}`);
        }
        
        if (response && (response.status === 400 || response.status === 403)) {
          appendChatMessage(
            "bot",
            `<div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-weight:700; color:var(--accent-rose);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              API Key Error
            </div>
            ${escapeHtml(errMsg)}<br><br>ദയവായി നിങ്ങളുടെ Google AI Studio API key പരിശോധിക്കുക. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:var(--accent-cyan); text-decoration:underline;">aistudio.google.com</a> വഴി പുതിയ key നേടാവുന്നതാണ്.`
          );
          toggleAiKeyBox(true);
        } else if (response && response.status === 404) {
          appendChatMessage(
            "bot",
            `<div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-weight:700; color:var(--accent-amber);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Generative Language API Enable ചെയ്തിട്ടില്ല
            </div>
            Google AI Studio API കീകളിൽ ഈ 404 എറർ വരുന്നത് ആ പ്രൊജക്റ്റിൽ <em>Generative Language API</em> ഓൺ അല്ലാത്തതുകൊണ്ടാണ്.<br><br>
            <strong>ലളിതമായ പരിഹാരം (1 മിനിറ്റ്):</strong><br>
            1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:var(--accent-cyan); text-decoration:underline; font-weight:700;">aistudio.google.com/app/apikey</a> സന്ദർശിക്കുക.<br>
            2. <b>"Create API key"</b> ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.<br>
            3. പ്രൊജക്റ്റ് തിരഞ്ഞെടുക്കുമ്പോൾ <b>"Create API key in new project"</b> തിരഞ്ഞെടുക്കുക.<br>
            4. പുതിയ കീ കോപ്പി ചെയ്ത് മുകളിലെ API Key ബോക്സിൽ നൽകി <b>Save</b> ചെയ്യുക.<br><br>
            പുതിയ പ്രൊജക്റ്റിൽ ആവശ്യമായ API ഗൂഗിൾ സ്വയം എനേബിൾ ചെയ്യുന്നത് കൊണ്ട് ഇത് ഉടൻ പ്രവർത്തിക്കും.`
          );
          toggleAiKeyBox(true);
        } else {
          appendChatMessage(
            "bot", 
            `<div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-weight:700; color:var(--accent-amber);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Error from Gemini API
            </div>
            ${escapeHtml(errMsg || "Connection failed")}`
          );
        }
        return;
      }

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botReply) {
        // Save to conversational memory
        aiConversationHistory.push({ role: "user", text: rawInput });
        aiConversationHistory.push({ role: "model", text: botReply });

        // Update active session history
        const activeSess = getCurrentAiSession();
        if (activeSess) {
          activeSess.history = [...aiConversationHistory];
          saveAiSessionsToStorage();
        }

        appendChatMessage("bot", formatAiResponse(botReply));
      } else {
        appendChatMessage("bot", "ഹലോ, എനിക്ക് ഉത്തരം ലഭിച്ചില്ല. ദയവായി ചോദ്യം വീണ്ടും ചോദിക്കാമോ?");
      }
    } catch (err) {
      const typingEl = document.getElementById(typingBubbleId);
      if (typingEl) typingEl.remove();

      if (err.name === "AbortError" || (aiAbortController && aiAbortController.signal.aborted)) {
        appendChatMessage("bot", '<span style="color:var(--text-muted); font-size:0.85rem; font-style:italic;">മറുപടി നൽകുന്നത് നിർത്തിവെച്ചു (Stopped).</span>');
        return;
      }

      appendChatMessage(
        "bot",
        `<div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-weight:700; color:var(--accent-amber);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Network or Connection Error
        </div>
        ${escapeHtml(err.message || String(err))}<br>ദയവായി നിങ്ങളുടെ ഇൻ്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.`
      );
    } finally {
      isAiGenerating = false;
      aiAbortController = null;
      updateSendButtonState(false);
    }
  }

  function initAiAssistant() {
    loadAiSessionsFromStorage();
    renderActiveSessionMessages();
    updateAiKeyStatus();
    updateAiContextChip();

    // If key not yet stored, leave key box open on first load
    if (!getGeminiApiKey()) {
      toggleAiKeyBox(true);
    } else {
      toggleAiKeyBox(false);
    }

    if (headerAiBtn) {
      headerAiBtn.addEventListener("click", toggleAiDrawer);
    }

    if (aiFab) {
      aiFab.addEventListener("click", toggleAiDrawer);
    }

    if (closeAiDrawerBtn) {
      closeAiDrawerBtn.addEventListener("click", () => {
        closeAiDrawer();
        if (currentOpenDayId !== null) {
          focusEditor(currentOpenDayId);
        }
      });
    }

    if (aiNewChatBtn) {
      aiNewChatBtn.addEventListener("click", () => {
        createNewAiSession();
        toggleAiHistoryPanel(false);
        showToast("New chat started.");
      });
    }

    if (aiHistoryBtn) {
      aiHistoryBtn.addEventListener("click", () => {
        toggleAiHistoryPanel();
      });
    }

    if (aiHistoryNewBtn) {
      aiHistoryNewBtn.addEventListener("click", () => {
        createNewAiSession();
        toggleAiHistoryPanel(false);
        showToast("New chat started.");
      });
    }

    if (aiHistoryList) {
      aiHistoryList.addEventListener("click", (e) => {
        const delBtn = e.target.closest(".ai-history-item-del");
        if (delBtn) {
          e.stopPropagation();
          const id = delBtn.getAttribute("data-del-id");
          if (id) deleteAiSession(id, e);
          return;
        }

        const item = e.target.closest(".ai-history-item");
        if (item) {
          const id = item.getAttribute("data-session-id");
          if (id) switchAiSession(id);
        }
      });
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

    // Delegate code copy and user message edit inside AI messages
    if (aiMessagesEl) {
      aiMessagesEl.addEventListener("click", (e) => {
        const copyBtn = e.target.closest(".ai-snippet-copy");
        if (copyBtn) {
          const preWrapper = copyBtn.closest(".ai-pre-wrapper");
          const codeEl = preWrapper ? preWrapper.querySelector("code") : null;
          if (codeEl) {
            copyToClipboard(codeEl.textContent, copyBtn);
          }
          return;
        }

        const editBtn = e.target.closest(".ai-msg-edit-btn");
        if (editBtn) {
          const msgDiv = editBtn.closest(".ai-msg.user");
          const bubble = msgDiv ? msgDiv.querySelector(".ai-bubble") : null;
          if (bubble && aiUserInput) {
            const rawText = bubble.innerText || bubble.textContent;
            aiUserInput.value = rawText.trim();
            aiUserInput.style.height = "auto";
            aiUserInput.style.height = Math.min(aiUserInput.scrollHeight, 120) + "px";
            aiUserInput.focus();
            showToast("Message loaded into input for editing.");
          }
        }
      });
    }

    // Initialize AI Drawer Draggable Resizer
    initAiDrawerResizer();

    // Close chat history panel or settings box when clicking outside or in the chat message area
    document.addEventListener("click", (e) => {
      // 1. Chat History Dropdown Click-Outside
      if (aiHistoryPanel && aiHistoryPanel.style.display !== "none") {
        const clickedInsidePanel = aiHistoryPanel.contains(e.target);
        const clickedHistoryBtn = aiHistoryBtn && aiHistoryBtn.contains(e.target);
        if (!clickedInsidePanel && !clickedHistoryBtn) {
          toggleAiHistoryPanel(false);
        }
      }

      // 2. Settings Key Box Click-Outside
      if (aiKeyBox && aiKeyBox.style.display !== "none") {
        const clickedInsideBox = aiKeyBox.contains(e.target);
        const clickedSettingsBtn = aiSettingsBtn && aiSettingsBtn.contains(e.target);
        if (!clickedInsideBox && !clickedSettingsBtn) {
          toggleAiKeyBox(false);
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && aiDrawer && aiDrawer.classList.contains("open")) {
        closeAiDrawer();
        if (currentOpenDayId !== null) {
          focusEditor(currentOpenDayId);
        }
      }
    });
  }

  // Start App
  document.addEventListener("DOMContentLoaded", init);
})();
