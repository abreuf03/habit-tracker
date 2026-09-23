async function initStats() {
    const stats = await getStats();

    // TODO 1: pinta la racha global dentro de #global-streak
    const container = document.getElementById('global-streak');
    container.innerHTML = ''; // Clear the container before rendering
    const div = document.createElement('div');
    div.textContent = `Racha actual: ${stats.globalStreak.current} días · Récord: ${stats.globalStreak.longest} días`;
    container.appendChild(div);

    // TODO 2: recorre stats.habitStreaks y crea un <li> por cada hábito
    // dentro de #habit-streaks-list
    const streakList = document.getElementById('habit-streaks-list');
    stats.habitStreaks.forEach(element => {
        const li = document.createElement('li');
        li.textContent = `${element.name} — Racha actual: ${element.current} · Récord: ${element.longest}`;
        streakList.appendChild(li);
    });
}

initStats();