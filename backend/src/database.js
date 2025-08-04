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

  // Institutions table
  db.run(`
    CREATE TABLE IF NOT EXISTS institutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT, -- 'university', 'community_college', 'certification_body', 'online', etc.
      website TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating institutions table:', err);
    else insertDefaultInstitutions();
  });

  // Educational Programs (Degrees, Certifications)
  db.run(`
    CREATE TABLE IF NOT EXISTS educational_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      institution_id INTEGER,
      institution TEXT, -- Keep for backward compatibility
      status TEXT DEFAULT 'planned',
      total_credits INTEGER,
      credits_completed INTEGER DEFAULT 0,
      start_date DATE,
      target_completion_date DATE,
      completion_date DATE,
      gpa REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id)
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
      institution_id INTEGER,
      institution TEXT, -- Keep for backward compatibility
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id)
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

  console.log('📊 Database tables initialized (with institutions support)');
}

function insertDefaultInstitutions() {
  // Check if we already have institutions to avoid duplicates
  db.get('SELECT COUNT(*) as count FROM institutions', (err, row) => {
    if (err) return;
    
    if (row && row.count === 0) {
      console.log('🏫 Inserting default institutions...');
      
      const defaultInstitutions = [
        ['Santiago Canyon College', 'community_college', 'https://www.sccollege.edu/'],
        ['Santa Ana College', 'community_college', 'https://www.sac.edu/'],
        ['University of California, Irvine', 'university', 'https://uci.edu/'],
        ['California State University, Fullerton', 'university', 'https://www.fullerton.edu/'],
        ['Amazon Web Services', 'certification_body', 'https://aws.amazon.com/certification/'],
        ['Google', 'certification_body', 'https://grow.google/certificates/'],
        ['Coursera', 'online', 'https://www.coursera.org/'],
        ['Udemy', 'online', 'https://www.udemy.com/'],
        ['Other', 'other', null]
      ];
      
      defaultInstitutions.forEach((institution, index) => {
        db.run(`INSERT INTO institutions (name, type, website) VALUES (?, ?, ?)`,
          institution,
          function(err) {
            if (err) console.error(`Error inserting institution ${index + 1}:`, err);
          }
        );
      });
      
      console.log('✅ Default institutions inserted');
    }
  });
}

module.exports = db;