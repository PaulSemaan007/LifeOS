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
  // Keep the original simple education table for backward compatibility
  db.run(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'planned',
      progress INTEGER DEFAULT 0,
      start_date DATE,
      target_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating education table:', err);
  });

  // Educational Programs (Degrees, Certifications)
  db.run(`
    CREATE TABLE IF NOT EXISTS educational_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      institution TEXT,
      status TEXT DEFAULT 'planned',
      total_credits INTEGER,
      credits_completed INTEGER DEFAULT 0,
      start_date DATE,
      target_completion_date DATE,
      completion_date DATE,
      gpa REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating educational_programs table:', err);
  });

  // Individual Courses/Classes
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      credits INTEGER DEFAULT 3,
      description TEXT,
      institution TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating courses table:', err);
  });

  // Course Prerequisites
  db.run(`
    CREATE TABLE IF NOT EXISTS course_prerequisites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      prerequisite_course_id INTEGER NOT NULL,
      UNIQUE(course_id, prerequisite_course_id)
    )
  `, (err) => {
    if (err) console.error('Error creating course_prerequisites table:', err);
  });

  // Course Completions
  db.run(`
    CREATE TABLE IF NOT EXISTS course_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      program_id INTEGER,
      semester TEXT,
      year INTEGER,
      grade TEXT,
      grade_points REAL,
      status TEXT DEFAULT 'completed',
      completion_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating course_completions table:', err);
  });

  // Program Requirements
  db.run(`
    CREATE TABLE IF NOT EXISTS program_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      requirement_type TEXT DEFAULT 'required',
      category TEXT,
      UNIQUE(program_id, course_id)
    )
  `, (err) => {
    if (err) console.error('Error creating program_requirements table:', err);
  });

  // Transfer Credits
  db.run(`
    CREATE TABLE IF NOT EXISTS transfer_credits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      completion_id INTEGER NOT NULL,
      transfer_to_program_id INTEGER NOT NULL,
      equivalent_course_id INTEGER,
      transfer_credits INTEGER,
      transfer_status TEXT DEFAULT 'approved',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating transfer_credits table:', err);
  });

  // Finances table (keeping existing)
  db.run(`
    CREATE TABLE IF NOT EXISTS finances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating finances table:', err);
  });

  // Fitness table (keeping existing)
  db.run(`
    CREATE TABLE IF NOT EXISTS fitness (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      activity TEXT,
      value REAL,
      unit TEXT,
      notes TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating fitness table:', err);
  });

  // Career table (keeping existing)
  db.run(`
    CREATE TABLE IF NOT EXISTS career (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      priority INTEGER DEFAULT 3,
      target_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating career table:', err);
  });

  console.log('📊 Database tables initialized (no sample data)');
}

module.exports = db;