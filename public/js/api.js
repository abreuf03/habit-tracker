//const BASE_URL = 'http://localhost:3000/api/habits';
const BASE_URL = '/api/habits';
// Function to fetch and display habits
async function getHabits() {
    try {
        const response = await fetch(`${BASE_URL}`);
        return await response.json();
    } catch (error) {
        return null;
    }

}

// Function to create a new habit
async function createHabit(name, type) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type })
        });
        return await response.json();  
    } catch (error) {
        return null;
    }

}  

// Function to mark a habit as completed for a specific date
async function logHabit(habitId, date) {
    try {
        const response = await fetch(`${BASE_URL}/${habitId}/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        });
        const data = await response.json();
        return {ok: response.ok, data}; // Return both the status and the data
    } catch (error) {
        return { ok: false, data: { error: 'No se pudo conectar con el servidor' } };
    }

}

// Function to get the summary of logs grouped by date
async function getLogsSummary() {
    try {
        const response = await fetch(`${BASE_URL}/logs-summary`);
        return await response.json();       
    } catch (error) {
        return null;
    }

}

//Function to delete a habit 
async function deleteHabit(habitId){
    try {
        const response = await fetch(`${BASE_URL}/${habitId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return {ok: response.ok, data}; // Return both the status and the data 
    } catch (error) {
        return { ok: false, data: { error: 'No se pudo conectar con el servidor' } };
    }

}

// Function to edit a habit
async function editHabit(habitId, name, type) {
    try {
        const response = await fetch(`${BASE_URL}/${habitId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type })
        });
        const data = await response.json();
        return {ok: response.ok, data}; // Return both the status and the data
    } catch (error) {
        return { ok: false, data: { error: 'No se pudo conectar con el servidor' } };
    }

}

// Function to get all habits completed for a specific date
async function getHabitsByDate(date) {
    try {
        const response = await fetch(`${BASE_URL}/logs/${date}`);
        return await response.json();        
    } catch (error) {
        return null;
    }

}

// Function to delete a habit log for a specific date
async function unlogHabit(habitId, date) {
    try {
        const response = await fetch(`${BASE_URL}/${habitId}/logs/${date}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return {ok: response.ok, data}; // Return both the status and the data
    } catch (error) {
        return { ok: false, data: { error: 'No se pudo conectar con el servidor' } };
    }

}

// Function to get stats
async function getStats(){
    try {
        const response = await fetch(`${BASE_URL}/stats`);
        return await response.json();    
    } catch (error) {
        return null;
    }

}
