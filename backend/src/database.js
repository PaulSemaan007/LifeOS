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

  console.log('📊 Database tables initialized');
  
  // Wait a bit then insert sample data
  setTimeout(() => {
    insertSampleData();
  }, 1000);
}

function insertSampleData() {
  // Check if we already have data to avoid duplicates
  db.get('SELECT COUNT(*) as count FROM educational_programs', (err, row) => {
    if (err) {
      console.error('Error checking programs:', err);
      return;
    }
    
    if (row && row.count === 0) {
      console.log('🌱 Inserting sample education data...');
      
      // Insert programs one by one to avoid syntax issues
      db.run(`INSERT INTO educational_programs (name, type, institution, status, total_credits, start_date) VALUES (?, ?, ?, ?, ?, ?)`,
        ['Associate in Computer Science', 'associate', 'Community College', 'completed', 60, '2020-08-15'],
        function(err) {
          if (err) console.error('Error inserting program 1:', err);
        }
      );
      
      db.run(`INSERT INTO educational_programs (name, type, institution, status, total_credits, start_date) VALUES (?, ?, ?, ?, ?, ?)`,
        ['Bachelor of Science in Computer Science', 'bachelor', 'State University', 'in-progress', 120, '2022-08-20'],
        function(err) {
          if (err) console.error('Error inserting program 2:', err);
        }
      );
      
      db.run(`INSERT INTO educational_programs (name, type, institution, status) VALUES (?, ?, ?, ?)`,
        ['AWS Cloud Practitioner', 'certification', 'Amazon Web Services', 'planned'],
        function(err) {
          if (err) console.error('Error inserting program 3:', err);
        }
      );
      
      // Insert courses
      const courses = [
        ['CS101', 'Introduction to Programming', 3, 'Community College'],
        ['CS102', 'Data Structures', 3, 'Community College'],
        ['MATH150', 'College Algebra', 3, 'Community College'],
        ['MATH151', 'Calculus I', 4, 'Community College'],
        ['CS201', 'Advanced Programming', 3, 'State University'],
        ['CS301', 'Database Systems', 3, 'State University']
      ];
      
      courses.forEach((course, index) => {
        db.run(`INSERT INTO courses (code, name, credits, institution) VALUES (?, ?, ?, ?)`,
          course,
          function(err) {
            if (err) console.error(`Error inserting course ${index + 1}:`, err);
          }
        );
      });
      
      // Wait for courses to be inserted, then add prerequisites and completions
      setTimeout(() => {
        // Add prerequisites
        db.run(`INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (2, 1)`, (err) => {
          if (err) console.error('Error inserting prerequisite 1:', err);
        });
        db.run(`INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (4, 3)`, (err) => {
          if (err) console.error('Error inserting prerequisite 2:', err);
        });
        db.run(`INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (5, 2)`, (err) => {
          if (err) console.error('Error inserting prerequisite 3:', err);
        });
        
        // Add completions
        const completions = [
          [1, 1, 'Fall', 2020, 'A', 4.0, '2020-12-15'],
          [3, 1, 'Fall', 2020, 'B+', 3.3, '2020-12-15'],
          [2, 1, 'Spring', 2021, 'A-', 3.7, '2021-05-15'],
          [4, 1, 'Spring', 2021, 'B', 3.0, '2021-05-15']
        ];
        
        completions.forEach((completion, index) => {
          db.run(`INSERT INTO course_completions (course_id, program_id, semester, year, grade, grade_points, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            completion,
            function(err) {
              if (err) console.error(`Error inserting completion ${index + 1}:`, err);
            }
          );
        });
        
        // Add requirements
        const requirements = [
          [1, 1, 'required', 'Core CS'],
          [1, 2, 'required', 'Core CS'],
          [1, 3, 'required', 'Math Requirements'],
          [1, 4, 'required', 'Math Requirements'],
          [2, 5, 'required', 'Core CS'],
          [2, 6, 'required', 'Core CS']
        ];
        
        requirements.forEach((requirement, index) => {
          db.run(`INSERT INTO program_requirements (program_id, course_id, requirement_type, category) VALUES (?, ?, ?, ?)`,
            requirement,
            function(err) {
              if (err) console.error(`Error inserting requirement ${index + 1}:`, err);
            }
          );
        });
        
        console.log('✅ Sample education data insertion completed');
      }, 2000);
    }
  });
}

module.exports = db;