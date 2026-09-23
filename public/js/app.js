const form = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');

// Function to render habits in the list
function renderHabits(habits, loggedIds) {
    habitList.innerHTML = ''; // Clear the list before rendering
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.dataset.type = habit.type;
        li.textContent = `${habit.name} (${habit.type})`;

        const isLogged = loggedIds.has(habit.id);

        //buttons
        const logButton = document.createElement('button');
        logButton.textContent = isLogged ? 'Desmarcar' : 'Marcar como hecho';
        if (isLogged) {
            logButton.classList.add('logged');
        }

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Eliminar';

        // Event listener for logging a habit (this is now handled in the renderHabits function)
        logButton.addEventListener('click', async () => {
            const today = new Date().toISOString().split('T')[0];   
            if (isLogged) {
                const result = await unlogHabit(habit.id, today);
                if (result.ok) {
                    alert(`Hábito "${habit.name}" desmarcado como hecho hoy.`);
                    await init(); // Refresh the habits list to update the logged status
                }
                else {
                    alert(`Error al desmarcar el hábito como hecho: ${result.data.error}`);
                }
            } else {
                const result = await logHabit(habit.id, today);
                if (result.ok) {
                    alert(`Hábito "${habit.name}" marcado como hecho hoy.`);
                    await init(); // Refresh the habits list to update the logged status
                }
                else {
                    alert(`Error al marcar el hábito como hecho: ${result.data.error}`);
                }
            }
        });

        // Event listener for editing a habit
        editButton.addEventListener('click', async () => {
            enterEditMode(li,habit);
        });

        // Event listener for deleting a habit
        deleteButton.addEventListener('click', async () => {
            const result = await deleteHabit(habit.id);
            if (result.ok) {
                alert(`Hábito "${habit.name}" eliminado.`);
                await init(); // Refresh the habits list after deletion
            }
            else{
                alert(`Error al eliminar el hábito: ${result.data.error}`);
            }
        });

        const actions = document.createElement('div');
        actions.className = 'habit-actions';
        actions.appendChild(logButton);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(actions); // en vez de añadir los 3 botones sueltos al li
        habitList.appendChild(li);
    });
}

// Function to fetch and display habits on page load
async function init() {
    const habits = await getHabits();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const todayLogs = await getHabitsByDate(today);
    const loggedIds = new Set(todayLogs.map(log => log.id));
    renderHabits(habits, loggedIds);
}

// Event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = document.getElementById('habit-name').value;
    const type = document.getElementById('habit-type').value;
    createHabit(name, type).then(async() => {
        await init(); // Refresh the habits list after creation
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

// Function to enter edit mode for a habit
async function enterEditMode(li, habit) {
    li.innerHTML = ''; // Clear the list item content
    const nameInput = document.createElement('input');
    nameInput.value = habit.name;

    const typeInput = document.createElement('select');
    const optionHealth = document.createElement('option');
    optionHealth.value = 'salud';
    optionHealth.textContent = 'Salud';
    const optionStudy = document.createElement('option');
    optionStudy.value = 'estudio';
    optionStudy.textContent = 'Estudio';
    const optionSocial = document.createElement('option');
    optionSocial.value = 'social';
    optionSocial.textContent = 'Social';
    const optionFun = document.createElement('option');
    optionFun.value = 'ocio';
    optionFun.textContent = 'Ocio';

    if (habit.type === 'salud') optionHealth.selected = true;
    else if (habit.type === 'estudio') optionStudy.selected = true;
    else if (habit.type === 'social') optionSocial.selected = true;
    else if (habit.type === 'ocio') optionFun.selected = true;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';

    saveButton.addEventListener('click', async () => {
        const result = await editHabit(habit.id, nameInput.value, typeInput.value);
        
        if(result.ok){
            alert(`Hábito "${habit.name}" editado.`);
            await init(); // Refresh the habits list after editing
        }
        else{
            alert(`Error al editar el hábito: ${result.data.error}`);
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    
    cancelButton.addEventListener('click', async () => {
        await init(); // Refresh the habits list to exit edit mode
    });

    li.appendChild(nameInput);
    li.appendChild(typeInput);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);
    typeInput.appendChild(optionHealth);
    typeInput.appendChild(optionStudy);
    typeInput.appendChild(optionSocial);
    typeInput.appendChild(optionFun);
}

// Initialize the app
init();
initCalendar(); // Initialize the calendar on page load