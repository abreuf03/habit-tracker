// Function to get the last N days as an array of date strings in YYYY-MM-DD format

function getLastNDays(n) {
    const today = new Date();
    const lastNDays = [];
    for (let i = 0; i < n; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayString = day.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
        lastNDays.push(dayString);
    }
    return lastNDays.reverse(); // Reverse to have the most recent date last
}

// Function to transform the logs-summary array into an object for easier access
function buildCountMap(logsSummary) {
    const countMap = {};
    logsSummary.forEach(entry => {
        countMap[entry.date] = entry.count;
    });
    return countMap;
}

// Function to combine the list of days with the count map
function buildCalendarData(lastNDays, countMap) {
    return lastNDays.map(date => ({
        date,
        count: countMap[date] || 0 // Default to 0 if no entry exists for that date
    }));
}

// Function to render the calendar
function renderCalendar(calendarData) {
    const container = document.getElementById('calendar');
    container.innerHTML = ''; // Clear the container before rendering
    calendarData.forEach(entry => {
        const div = document.createElement('div');
        
        const level = getLevel(entry.count); 
        
        div.classList.add('day-cell', `level-${level}`);
        div.title = `${entry.date}: ${entry.count} hábito(s) completados`;
        
        container.appendChild(div);
    });
}

//Function to transform count into a level 
function getLevel(count) {
    if (count === 0) return 0;
    if (count >= 1 && count <= 2) return 1;
    if (count >= 3 && count <= 4) return 2;
    if (count >= 5) return 3;
}