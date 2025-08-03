const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '../database/lifeos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Education table
  db.run(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL, -- course, book, skill, etc.
      status TEXT DEFAULT 'planned', -- planned, in-progress, completed
      progress INTEGER DEFAULT 0, -- 0-100
      start_date DATE,
      target_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Finances table
  db.run(`
    CREATE TABLE IF NOT EXISTS finances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- income, expense, investment, saving
      category TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Fitness table
  db.run(`
    CREATE TABLE IF NOT EXISTS fitness (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- workout, weight, measurement, goal
      activity TEXT,
      value DECIMAL(10,2),
      unit TEXT, -- kg, lbs, minutes, reps, etc.
      notes TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Career table
  db.run(`
    CREATE TABLE IF NOT EXISTS career (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- goal, skill, achievement, application, interview
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active', -- active, completed, paused
      priority INTEGER DEFAULT 3, -- 1-5 scale
      target_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('📊 Database tables initialized');
}

module.exports = db;