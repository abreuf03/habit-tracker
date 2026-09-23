const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateStreaks } = require('./utils');

// GET -> list all habits

router.get('/', (req, res) => {
    const habits = db.prepare(`
        SELECT * FROM habits
    `).all();
    res.json(habits);
});

// POST -> create a new habit
router.post('/', (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }
    else{
        const result = db.prepare(`
            INSERT INTO habits (name, type) VALUES (?, ?)
        `).run(name, type);
        res.status(201).json({ id: result.lastInsertRowid, name, type });
    }

});

// POST -> mark a habit as completed for a specific date
router.post('/:id/log', (req, res) => {
    const habitId = req.params.id;
    const { date } = req.body;
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO habit_logs (habit_id, date) VALUES (?, ?)
        `).run(habitId, date);
        res.status(201).json({ id: result.lastInsertRowid, habit_id: habitId, date });
    }
    catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Habit already logged for this date' });
        }
        else if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(404).json({ error: 'Habit not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET -> list habits completed for a specific date
router.get('/logs/:date', (req, res) => {
    const { date } = req.params;
    const logs = db.prepare(`
        SELECT habits.id, habits.name, habits.type, habit_logs.date
        FROM habit_logs
        JOIN habits ON habit_logs.habit_id = habits.id
        WHERE habit_logs.date = ?
    `).all(date);
    res.json(logs);
});


// DELETE -> delete a habit
router.delete('/:id/logs/:date', (req, res) => {
    const habitId = req.params.id;
    const date = req.params.date; // Get the date from the URL parameters

    const result = db.prepare(`
        DELETE FROM habit_logs WHERE habit_id = ? AND date = ?
    `).run(habitId, date);
    
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Habit log not found for the specified date' });
    }
    else {
        res.status(200).json({ message: 'Habit log deleted successfully' });
    }
});

// GET -> group logs by date and count the number of habits completed for each date
router.get('/logs-summary', (req, res) => {
    const summary = db.prepare(`
        SELECT date, COUNT(*) as count
        FROM habit_logs
        GROUP BY date
    `).all();
    res.json(summary);
});

// PUT -> edit an habit
router.put('/:id', (req, res) => {
    const habitId = req.params.id;
    const { name, type } = req.body;
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }
    const result = db.prepare(`
        UPDATE habits SET name = ?, type = ? WHERE id = ?
    `).run(name, type, habitId);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Habit not found' });
    }
    else{
        return res.status(200).json({ id: habitId, name, type });
    }
});

// DELETE -> delete an habit and its logs
router.delete('/:id', (req, res) => {
    const habitId = req.params.id;
    const result = db.prepare(`
        DELETE FROM habit_logs WHERE habit_id = ?
    `).run(habitId);
    const habitResult = db.prepare(`
        DELETE FROM habits WHERE id = ?
    `).run(habitId);

    if (habitResult.changes === 0) {
        return res.status(404).json({ error: 'Habit not found' });
    }
    res.status(200).json({ message: 'Habit and its logs deleted successfully' });
});


// stats

router.get('/stats', (req, res) =>{
    const habits = db.prepare(`
        SELECT * FROM habits
    `).all();
    
    const habitStreaks = habits.map(habit => {
        const logDates = db.prepare(`
            SELECT date FROM habit_logs
            WHERE habit_id = ?
            ORDER BY date
        `).all(habit.id); 

        const logDatesString = logDates.map(row => row.date);
        
        const streaks = calculateStreaks(logDatesString); // devuelve { current, longest }

        return {
            id: habit.id,
            name: habit.name,
            type: habit.type,
            current: streaks.current,
            longest: streaks.longest
        };
    });
    
    const globalLogDates = db.prepare(`
            SELECT DISTINCT date FROM habit_logs
            ORDER BY date
    `).all(); 
    
    const globalLogDatesString = globalLogDates.map(row => row.date);
    const globalStreak = calculateStreaks(globalLogDatesString);

    res.json({ habitStreaks, globalStreak });
});

module.exports = router;