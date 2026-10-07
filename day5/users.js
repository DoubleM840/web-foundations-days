// --- SELECT ELEMENTS ---
const loadBtn = document.querySelector("#load-users");
const statusText = document.querySelector("#status");
const filterInput = document.querySelector("#filter-input");
const usersList = document.querySelector("#users-list");

// --- STATE ---
let allUsers = [];

// --- RENDER FUNCTION ---
function renderUsers(users) {
    usersList.innerHTML = "";
    
    if (users.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No users match your filter.";
        li.style.color = "#777";
        li.style.fontStyle = "italic";
        usersList.appendChild(li);
        return;
    }
    
    users.forEach(user => {
        const li = document.createElement("li");
        
        const nameStrong = document.createElement("strong");
        nameStrong.textContent = user.name;
        
        const emailSpan = document.createElement("span");
        emailSpan.textContent = `📧 ${user.email}`;
        
        const citySpan = document.createElement("span");
        citySpan.textContent = ` ${user.address.city}`;
        
        const companySpan = document.createElement("span");
        companySpan.textContent = `🏢 ${user.company.name}`;
        
        li.appendChild(nameStrong);
        li.appendChild(emailSpan);
        li.appendChild(citySpan);
        li.appendChild(companySpan);
        usersList.appendChild(li);
    });
}

// --- LOAD USERS FROM API ---
async function loadUsers() {
    // Loading State
    statusText.textContent = "Loading users...";
    statusText.className = "";
    loadBtn.disabled = true;
    filterInput.disabled = true;
    usersList.innerHTML = "";
    
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        // Check for HTTP errors (fetch doesn't throw on 4xx/5xx!)
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const users = await response.json();
        allUsers = users;
        
        // Success State
        renderUsers(allUsers);
        statusText.textContent = `Successfully loaded ${users.length} users.`;
        statusText.className = "success";
        filterInput.disabled = false;
        
    } catch (error) {
        // Error State
        statusText.textContent = `Error: ${error.message}. Please try again.`;
        statusText.className = "error";
        console.error("Failed to load users:", error);
        
    } finally {
        // Always re-enable button
        loadBtn.disabled = false;
    }
}

// --- EVENT LISTENERS ---

// Load button click
loadBtn.addEventListener("click", loadUsers);

// Client-side filter (no new API request!)
filterInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === "") {
        renderUsers(allUsers);
        return;
    }
    
    const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(query)
    );
    
    renderUsers(filtered);
});