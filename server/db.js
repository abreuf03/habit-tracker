const Database = require('better-sqlite3');
const path = require('path');
const dbFileName = process.env.DB_FILE || 'habit-tracker.db';
const db = new Database(path.join(__dirname, dbFileName), { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS habits(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- health, social, work, etc. -> each type has a color associated with it
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS habit_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits(id),
        UNIQUE(habit_id, date) -- Ensure that each habit can only have one log per date
    )
`);

db.pragma('foreign_keys = ON'); // Enable foreign key constraints

module.exports = db;
