// --- STARTING DATA ---
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// --- FUNCTION 1: searchNotes(word) ---
// Returns array of notes whose text contains word (case-insensitive)
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(lowerWord));
}

// Tests for searchNotes
console.log("=== searchNotes Tests ===");
console.log(searchNotes("milk")); 
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log(searchNotes("JAVASCRIPT")); 
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("nonexistent")); 
// Expected: [] (empty array - edge case)


// --- FUNCTION 2: longestNote() ---
// Returns note object with most characters, or null if empty
function longestNote() {
  if (notes.length === 0) return null;
  
  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

// Tests for longestNote
console.log("\n=== longestNote Tests ===");
console.log(longestNote()); 
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Edge case: empty array
const originalNotes = [...notes]; // Save copy
notes = [];
console.log(longestNote()); 
// Expected: null
notes = originalNotes; // Restore


// --- FUNCTION 3: countByCategory() ---
// Returns object counting notes per category
function countByCategory() {
  const counts = {};
  notes.forEach((note) => {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  });
  return counts;
}

// Tests for countByCategory
console.log("\n=== countByCategory Tests ===");
console.log(countByCategory()); 
// Expected: { personal: 2, study: 2, work: 1 }


// --- FUNCTION 4: getSummary() ---
// Returns sentence like "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  
  const parts = Object.entries(counts).map(
    ([cat, count]) => `${count} ${cat}`
  );
  
  return `${total} ${noteWord}: ${parts.join(", ")}.`;
}

// Tests for getSummary
console.log("\n=== getSummary Tests ===");
console.log(getSummary()); 
// Expected: "5 notes: 2 personal, 2 study, 1 work."

// Edge case: single note
notes = [{ id: 99, text: "Test", category: "work" }];
console.log(getSummary()); 
// Expected: "1 note: 1 work."
notes = originalNotes; // Restore


// --- FUNCTION 5: isDuplicate(text) ---
// Returns true if note with same text exists (ignoring case/spaces)
function isDuplicate(text) {
  const cleaned = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleaned);
}

// Tests for isDuplicate
console.log("\n=== isDuplicate Tests ===");
console.log(isDuplicate("buy milk and bread")); 
// Expected: true (matches existing note, case-insensitive)

console.log(isDuplicate("  BUY MILK AND BREAD  ")); 
// Expected: true (ignores extra spaces)

console.log(isDuplicate("New unique note")); 
// Expected: false


// --- FUNCTION 6: addNote(text, category) ---
// Adds note only if valid (1-200 chars, not duplicate, valid category)
// Returns true if added, false otherwise (with reason logged)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  const cleanedText = text.trim();
  
  // Check length
  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log(`❌ Rejected: Note must be 1-200 characters.`);
    return false;
  }
  
  // Check duplicate
  if (isDuplicate(cleanedText)) {
    console.log(`❌ Rejected: Duplicate note.`);
    return false;
  }
  
  // Check category
  if (!validCategories.includes(category.toLowerCase())) {
    console.log(`❌ Rejected: Invalid category. Must be personal, work, or study.`);
    return false;
  }
  
  // All checks passed - add note
  const newNote = {
    id: Date.now(),
    text: cleanedText,
    category: category.toLowerCase(),
  };
  notes.push(newNote);
  console.log(`✅ Added: "${newNote.text}" (${newNote.category})`);
  return true;
}

// Tests for addNote
console.log("\n=== addNote Tests ===");
console.log(addNote("Learn Git properly", "study")); 
// Expected: true + success log

console.log(addNote("", "work")); 
// Expected: false + "must be 1-200 characters"

console.log(addNote("Buy milk and bread", "personal")); 
// Expected: false + "Duplicate note"

console.log(addNote("Valid note", "invalid")); 
// Expected: false + "Invalid category"

console.log(addNote("A".repeat(201), "work")); 
// Expected: false + "must be 1-200 characters" (edge case)