const form = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');

// Function to render habits in the list
function renderHabits(habits) {
    habitList.innerHTML = ''; // Clear the list before rendering
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.textContent = `${habit.name} (${habit.type})`;
        const logButton = document.createElement('button');
        logButton.textContent = 'Hecho hoy';
        // Event listener for logging a habit (this is now handled in the renderHabits function)
        logButton.addEventListener('click', async () => {
            const today = new Date().toISOString().split('T')[0];   
            const result = await logHabit(habit.id, today);
            if (result.ok) {
                alert(`Hábito "${habit.name}" marcado como hecho hoy.`);
            }
            else {
                alert(`Error al marcar el hábito como hecho: ${result.data.error}`);
            }   
        });
        li.appendChild(logButton);
        habitList.appendChild(li);
    });
}

// Function to fetch and display habits on page load
async function init() {
    const habits = await getHabits();
    renderHabits(habits);
}

// Event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = document.getElementById('habit-name').value;
    const type = document.getElementById('habit-type').value;
    createHabit(name, type).then(async() => {
        const habits = await getHabits();
        renderHabits(habits);
        form.reset(); // Clear the form after submission
    });
});

// Function to initialize the calendar
async function initCalendar() {
    const lastNDays = getLastNDays(30); // Get the last 30 days
    const logsSummary = await getLogsSummary(); // Fetch the logs summary from the server
    const countMap = buildCountMap(logsSummary); // Build a count map from the logs summary
    const calendarData = buildCalendarData(lastNDays, countMap); // Combine the last N days with the count map
    renderCalendar(calendarData); // Render the calendar with the combined data
}


// Initialize the app
init();
initCalendar(); // Initialize the calendar on page load