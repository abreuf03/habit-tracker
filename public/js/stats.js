async function initStats() {
    const stats = await getStats();
    if (stats === null) {
        document.getElementById('global-streak').innerHTML = '<li class="error">No se pudo conectar con el servidor. Comprueba tu conexión.</li>';
        return; 
    }

    const globalContainer = document.getElementById('global-streak');
    globalContainer.innerHTML = `
        <div class="global-streak-number">🔥 ${stats.globalStreak.current}</div>
        <div class="global-streak-label">días seguidos · récord: ${stats.globalStreak.longest} días</div>
    `;

    
    const groups = groupByType(stats.habitStreaks);
    const types = ['salud', 'estudio', 'social', 'ocio'];
    types.forEach(type => {
        const div = document.createElement('div');
        div.classList.add('type-group', type);
        const h3 = document.createElement('h3');
        h3.textContent = type;
        const ul = document.createElement('ul');

        if(groups[type].length==0){
            const li = document.createElement('li');
            li.textContent = `Sin hábitos en esta categoría`;
            ul.appendChild(li);
        }
        else{
            groups[type].forEach(element => {
                const li = document.createElement('li');
                li.textContent = `${element.name} — Racha actual: ${element.current} · Récord: ${element.longest}`;
                ul.appendChild(li);
            });
        }

        div.appendChild(h3);
        div.appendChild(ul);
        document.getElementById('type-groups').appendChild(div);
    });
    
}

function groupByType(habitStreaks) {
    const groups = { salud: [], estudio: [], social: [], ocio: [] };
    
    habitStreaks.forEach(habit => {
        groups[habit.type].push(habit);
    });

    return groups;
}

initStats();