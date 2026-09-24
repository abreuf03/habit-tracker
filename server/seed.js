process.env.DB_FILE = 'seed.db'; 
const db = require('./db');

db.prepare('DELETE FROM habit_logs').run();
db.prepare('DELETE FROM habits').run();

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

// Igual que daysAgo, pero devuelve fecha Y hora completas,
// para usarla como date_created (evita que varios hábitos
// insertados en el mismo segundo queden "empatados")
function daysAgoDateTime(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

const habitsData = [
    { name: 'Beber 2L de agua', type: 'salud', createdDaysAgo: 28 },
    { name: 'Leer 20 páginas', type: 'estudio', createdDaysAgo: 26 },
    { name: 'Llamar a un familiar', type: 'social', createdDaysAgo: 23 },
    { name: 'Meditar 10 minutos', type: 'ocio', createdDaysAgo: 20 },
    { name: 'Hacer ejercicio', type: 'salud', createdDaysAgo: 17 },
    { name: 'Quedar con amigos', type: 'social', createdDaysAgo: 14 },
    { name: 'Practicar inglés', type: 'estudio', createdDaysAgo: 11 },
    { name: 'Dibujar', type: 'ocio', createdDaysAgo: 8 },
    { name: 'Dormir 8 horas', type: 'salud', createdDaysAgo: 4 },
    { name: 'Escuchar un podcast', type: 'ocio', createdDaysAgo: 1 },
];

// Ahora insertamos también date_created explícitamente,
// en vez de dejar que la columna use su DEFAULT
const insertHabit = db.prepare('INSERT INTO habits (name, type, date_created) VALUES (?, ?, ?)');
const ids = {};
habitsData.forEach(h => {
    const result = insertHabit.run(h.name, h.type, daysAgoDateTime(h.createdDaysAgo));
    ids[h.name] = result.lastInsertRowid;
});

const insertLog = db.prepare('INSERT INTO habit_logs (habit_id, date) VALUES (?, ?)');

// Racha larga y activa (5 días seguidos, incluyendo hoy)
[0, 1, 2, 3, 4].forEach(n => insertLog.run(ids['Beber 2L de agua'], daysAgo(n)));

// Racha activa más corta (3 días, incluyendo hoy)
[0, 1, 2].forEach(n => insertLog.run(ids['Meditar 10 minutos'], daysAgo(n)));

// Racha que se rompió hace unos días (tuvo una racha, pero no continuó)
[3, 4, 5, 6].forEach(n => insertLog.run(ids['Practicar inglés'], daysAgo(n)));

// Marcado solo hoy (racha actual = 1)
insertLog.run(ids['Llamar a un familiar'], daysAgo(0));

// Marcado de forma intermitente (sin racha consecutiva)
[0, 2, 5].forEach(n => insertLog.run(ids['Leer 20 páginas'], daysAgo(n)));

// Racha corta activa
[0, 1].forEach(n => insertLog.run(ids['Hacer ejercicio'], daysAgo(n)));

// Sin actividad reciente
[7, 8].forEach(n => insertLog.run(ids['Dibujar'], daysAgo(n)));

console.log('Base de datos de producción (seed.db) poblada con datos de ejemplo ✅');