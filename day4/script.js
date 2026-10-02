// --- SECTION 1: SELECT DOM ELEMENTS ---
// Always verify these return actual elements, not null!
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const list = document.querySelector("#notes-list");
const countDisplay = document.querySelector("#note-count");

// Use a constant for storage key to prevent typos
const STORAGE_KEY = "quicknotes";

// --- SECTION 2: LOAD DATA FROM LOCALSTORAGE ---
// localStorage only stores strings, so we parse JSON back to array
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveNotes() {
    // Convert array back to string for storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// --- SECTION 3: RENDER FUNCTION (The Single Source of Truth) ---
// NEVER manipulate DOM directly. Always update data → call render()
function renderNotes() {
    // Clear existing list completely
    list.innerHTML = "";
    
    // Update count with correct grammar
    const noteWord = notes.length === 1 ? "note" : "notes";
    countDisplay.textContent = `You have ${notes.length} ${noteWord}.`;
    
    // Rebuild list from current data array
    notes.forEach((note) => {
        const li = document.createElement("li");
        li.classList.add("note");
        
        // SAFE text insertion (prevents XSS attacks)
        const textSpan = document.createElement("span");
        textSpan.textContent = note.text;
        
        // Delete button with closure to remember specific note ID
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            notes = notes.filter((n) => n.id !== note.id);
            saveNotes();
            renderNotes();
        });
        
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// --- SECTION 4: EVENT LISTENERS ---
form.addEventListener("submit", (event) => {
    // CRITICAL: Prevents page reload which would wipe unsaved data
    event.preventDefault();
    
    const text = input.value.trim();
    
    // Validation: reject empty or whitespace-only notes
    if (text === "") return;
    
    // Add new note object to array
    notes.push({
        id: Date.now(), // Unique timestamp-based ID
        text: text
    });
    
    // Save → Render → Clear Input
    saveNotes();
    renderNotes();
    input.value = "";
    input.focus();
});

// --- SECTION 5: INITIAL RENDER ON PAGE LOAD ---
renderNotes();