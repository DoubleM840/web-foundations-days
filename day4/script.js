// --- SELECT ELEMENTS ---
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// --- CONSTANTS ---
const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";
const MAX_CHARS = 200;
const WARNING_THRESHOLD = 180;

// --- CORE FUNCTION: UPDATE COUNTERS & CLASSES ---
function updateCounts() {
    const text = textarea.value;
    const charLen = text.length;
    
    // Word count: split by whitespace, filter out empty strings
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    
    // Update text
    charCount.textContent = `${charLen} / ${MAX_CHARS} characters`;
    wordCount.textContent = `${words} words`;
    
    // Update classes
    charCount.classList.remove("warning", "over");
    if (charLen > MAX_CHARS) {
        charCount.classList.add("over");
    } else if (charLen > WARNING_THRESHOLD) {
        charCount.classList.add("warning");
    }
    
    // Save draft on every input
    localStorage.setItem(DRAFT_KEY, text);
}

// --- EVENT LISTENERS ---

// 1. Live update on every keystroke/paste
textarea.addEventListener("input", updateCounts);

// 2. Clear button functionality
clearBtn.addEventListener("click", () => {
    textarea.value = "";
    updateCounts(); // Resets counters and removes classes
    localStorage.removeItem(DRAFT_KEY);
    textarea.focus();
});

// 3. Escape key clears textarea
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        textarea.value = "";
        updateCounts();
        localStorage.removeItem(DRAFT_KEY);
    }
});

// 4. Theme Toggle with Persistence
function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("dark");
    applyTheme(!isCurrentlyDark);
});

// --- INITIALIZATION ON LOAD ---
// Restore draft
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft !== null) {
    textarea.value = savedDraft;
}

// Restore theme
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark") {
    applyTheme(true);
}

// Initial counter update
updateCounts();