const Database = require('better-sqlite3');
const path = require('path');
const dbFileName = process.env.DB_FILE || 'habit-tracker.db';
const db = new Database(path.join(__dirname, dbFileName));


db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)


db.exec(`
    CREATE TABLE IF NOT EXISTS habits(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- health, social, work, etc. -> each type has a color associated with it
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id)
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
if (!db.prepare('PRAGMA table_info(habits)').all().some(col => col.name === 'user_id')){
    db.exec('ALTER TABLE habits ADD COLUMN user_id INTEGER REFERENCES users(id)')
}

module.exports = db;

