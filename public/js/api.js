const BASE_URL = 'http://localhost:3000/api/habits';

// Function to fetch and display habits
async function getHabits() {
    const response = await fetch(`${BASE_URL}`);
    return await response.json();
}

// Function to create a new habit
async function createHabit(name, type) {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, type })
    });
    return await response.json();
}  

// Function to mark a habit as completed for a specific date
async function logHabit(habitId, date) {
    const response = await fetch(`${BASE_URL}/${habitId}/log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date })
    });
    const data = await response.json();
    return {ok: response.ok, data}; // Return both the status and the data
}

// Function to get the summary of logs grouped by date
async function getLogsSummary() {
    const response = await fetch(`${BASE_URL}/logs-summary`);
    return await response.json();
}

//Function to delete a habit 
async function deleteHabit(habitId){
    const response = await fetch(`${BASE_URL}/${habitId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return {ok: response.ok, data}; // Return both the status and the data
}

// Function to edit a habit
async function editHabit(habitId, name, type) {
    const response = await fetch(`${BASE_URL}/${habitId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, type })
    });
    const data = await response.json();
    return {ok: response.ok, data}; // Return both the status and the data
}

// Function to get all habits completed for a specific date
async function getHabitsByDate(date) {
    const response = await fetch(`${BASE_URL}/logs/${date}`);
    return await response.json();
}

// Function to delete a habit log for a specific date
async function unlogHabit(habitId, date) {
    const response = await fetch(`${BASE_URL}/${habitId}/logs/${date}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return {ok: response.ok, data}; // Return both the status and the data
}

// Function to get stats
async function getStats(){
    const response = await fetch(`${BASE_URL}/stats`);
    return await response.json();
}
