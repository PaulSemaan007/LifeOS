const express = require('express');
const router = express.Router();
const db = require('../database');

// =============================================
// EDUCATIONAL PROGRAMS ROUTES
// =============================================

// GET all educational programs
router.get('/programs', (req, res) => {
  const query = `
    SELECT p.*, 
           COUNT(DISTINCT cc.id) as completed_courses,
           COALESCE(SUM(CASE WHEN cc.status = 'completed' THEN c.credits ELSE 0 END), 0) as credits_earned
    FROM educational_programs p
    LEFT JOIN course_completions cc ON p.id = cc.program_id AND cc.status = 'completed'
    LEFT JOIN courses c ON cc.course_id = c.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET single program with detailed progress
router.get('/programs/:id', (req, res) => {
  const programId = req.params.id;
  
  const programQuery = `
    SELECT p.*,
           COUNT(DISTINCT pr.course_id) as required_courses,
           COUNT(DISTINCT cc.id) as completed_courses,
           COALESCE(SUM(CASE WHEN cc.status = 'completed' THEN c.credits ELSE 0 END), 0) as credits_earned
    FROM educational_programs p
    LEFT JOIN program_requirements pr ON p.id = pr.program_id
    LEFT JOIN course_completions cc ON p.id = cc.program_id AND cc.status = 'completed'
    LEFT JOIN courses c ON cc.course_id = c.id
    WHERE p.id = ?
    GROUP BY p.id
  `;
  
  db.get(programQuery, programId, (err, program) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    
    // Get courses for this program
    const coursesQuery = `
      SELECT c.*, pr.requirement_type, pr.category,
             cc.grade, cc.grade_points, cc.semester, cc.year, cc.status as completion_status
      FROM courses c
      JOIN program_requirements pr ON c.id = pr.course_id
      LEFT JOIN course_completions cc ON c.id = cc.course_id AND cc.program_id = ?
      WHERE pr.program_id = ?
      ORDER BY pr.category, c.code
    `;
    
    db.all(coursesQuery, [programId, programId], (err, courses) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ 
        program: program,
        courses: courses 
      });
    });
  });
});

// POST create new educational program
router.post('/programs', (req, res) => {
  const { name, type, institution, status, total_credits, start_date, target_completion_date, notes } = req.body;
  
  db.run(
    `INSERT INTO educational_programs (name, type, institution, status, total_credits, start_date, target_completion_date, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, type, institution || null, status || 'planned', total_credits || null, start_date || null, target_completion_date || null, notes || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Educational program created successfully' });
    }
  );
});

// PUT update educational program
router.put('/programs/:id', (req, res) => {
  const { name, type, institution, status, total_credits, credits_completed, start_date, target_completion_date, completion_date, gpa, notes } = req.body;
  
  db.run(
    `UPDATE educational_programs 
     SET name=?, type=?, institution=?, status=?, total_credits=?, credits_completed=?, start_date=?, target_completion_date=?, completion_date=?, gpa=?, notes=?
     WHERE id=?`,
    [name, type, institution, status, total_credits, credits_completed, start_date, target_completion_date, completion_date, gpa, notes, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Educational program updated successfully' });
    }
  );
});

// =============================================
// COURSES ROUTES
// =============================================

// GET all courses
router.get('/courses', (req, res) => {
  const query = `
    SELECT c.*,
           GROUP_CONCAT(pc.code) as prerequisites
    FROM courses c
    LEFT JOIN course_prerequisites cp ON c.id = cp.course_id
    LEFT JOIN courses pc ON cp.prerequisite_course_id = pc.id
    GROUP BY c.id
    ORDER BY c.institution, c.code
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST create new course
router.post('/courses', (req, res) => {
  const { code, name, credits, description, institution } = req.body;
  
  db.run(
    `INSERT INTO courses (code, name, credits, description, institution) 
     VALUES (?, ?, ?, ?, ?)`,
    [code, name, credits || 3, description || null, institution || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Course created successfully' });
    }
  );
});

// =============================================
// COURSE COMPLETIONS ROUTES
// =============================================

// GET all course completions
router.get('/completions', (req, res) => {
  const query = `
    SELECT cc.*, c.code, c.name as course_name, c.credits,
           p.name as program_name, p.type as program_type
    FROM course_completions cc
    JOIN courses c ON cc.course_id = c.id
    LEFT JOIN educational_programs p ON cc.program_id = p.id
    ORDER BY cc.year DESC, cc.semester, c.code
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET completions by program
router.get('/programs/:id/completions', (req, res) => {
  const query = `
    SELECT cc.*, c.code, c.name as course_name, c.credits
    FROM course_completions cc
    JOIN courses c ON cc.course_id = c.id
    WHERE cc.program_id = ?
    ORDER BY cc.year DESC, cc.semester, c.code
  `;
  
  db.all(query, req.params.id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST create course completion
router.post('/completions', (req, res) => {
  const { course_id, program_id, semester, year, grade, grade_points, status, completion_date, notes } = req.body;
  
  db.run(
    `INSERT INTO course_completions (course_id, program_id, semester, year, grade, grade_points, status, completion_date, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [course_id, program_id || null, semester || null, year || null, grade || null, grade_points || null, status || 'completed', completion_date || null, notes || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Course completion recorded successfully' });
    }
  );
});

// =============================================
// PREREQUISITES ROUTES
// =============================================

// GET prerequisites for a course
router.get('/courses/:id/prerequisites', (req, res) => {
  const query = `
    SELECT c.id, c.code, c.name
    FROM courses c
    JOIN course_prerequisites cp ON c.id = cp.prerequisite_course_id
    WHERE cp.course_id = ?
  `;
  
  db.all(query, req.params.id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST add prerequisite
router.post('/courses/:id/prerequisites', (req, res) => {
  const { prerequisite_course_id } = req.body;
  
  db.run(
    `INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (?, ?)`,
    [req.params.id, prerequisite_course_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Prerequisite added successfully' });
    }
  );
});

// =============================================
// TRANSFER CREDITS ROUTES
// =============================================

// GET transfer credits for a program
router.get('/programs/:id/transfers', (req, res) => {
  const query = `
    SELECT tc.*, 
           c.code as original_course_code, c.name as original_course_name,
           ec.code as equivalent_course_code, ec.name as equivalent_course_name,
           cc.semester, cc.year, cc.grade
    FROM transfer_credits tc
    JOIN course_completions cc ON tc.completion_id = cc.id
    JOIN courses c ON cc.course_id = c.id
    LEFT JOIN courses ec ON tc.equivalent_course_id = ec.id
    WHERE tc.transfer_to_program_id = ?
    ORDER BY cc.year DESC, cc.semester
  `;
  
  db.all(query, req.params.id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST create transfer credit
router.post('/transfers', (req, res) => {
  const { completion_id, transfer_to_program_id, equivalent_course_id, transfer_credits, transfer_status, notes } = req.body;
  
  db.run(
    `INSERT INTO transfer_credits (completion_id, transfer_to_program_id, equivalent_course_id, transfer_credits, transfer_status, notes) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [completion_id, transfer_to_program_id, equivalent_course_id || null, transfer_credits || null, transfer_status || 'approved', notes || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Transfer credit recorded successfully' });
    }
  );
});

// =============================================
// PROGRAM REQUIREMENTS MANAGEMENT
// =============================================

// GET requirements for a specific program
router.get('/programs/:id/requirements', (req, res) => {
  const query = `
    SELECT pr.*, c.code, c.name as course_name, c.credits
    FROM program_requirements pr
    JOIN courses c ON pr.course_id = c.id
    WHERE pr.program_id = ?
    ORDER BY pr.category, c.code
  `;
  
  db.all(query, req.params.id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST add course requirement to program
router.post('/programs/:id/requirements', (req, res) => {
  const { course_id, requirement_type, category } = req.body;
  
  db.run(
    `INSERT INTO program_requirements (program_id, course_id, requirement_type, category) 
     VALUES (?, ?, ?, ?)`,
    [req.params.id, course_id, requirement_type || 'required', category || 'General'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Course requirement added successfully' });
    }
  );
});

// DELETE remove course requirement from program
router.delete('/programs/:programId/requirements/:requirementId', (req, res) => {
  db.run(
    'DELETE FROM program_requirements WHERE id = ? AND program_id = ?', 
    [req.params.requirementId, req.params.programId], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Course requirement removed successfully' });
    }
  );
});

// =============================================
// ANALYTICS & REPORTING ROUTES
// =============================================

// GET education dashboard stats
router.get('/stats', (req, res) => {
  const queries = {
    programs: `SELECT type, COUNT(*) as count, 
                      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                      COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress
               FROM educational_programs GROUP BY type`,
    
    gpa: `SELECT p.name as program_name, p.gpa,
                 ROUND(AVG(cc.grade_points), 2) as calculated_gpa
          FROM educational_programs p
          LEFT JOIN course_completions cc ON p.id = cc.program_id
          WHERE p.status IN ('in-progress', 'completed') AND cc.grade_points IS NOT NULL
          GROUP BY p.id, p.name, p.gpa`,
    
    recent_completions: `SELECT c.code, c.name, cc.grade, cc.semester, cc.year
                        FROM course_completions cc
                        JOIN courses c ON cc.course_id = c.id
                        ORDER BY cc.completion_date DESC LIMIT 5`
  };
  
  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;
  
  for (const [key, query] of Object.entries(queries)) {
    db.all(query, (err, rows) => {
      if (!err) results[key] = rows;
      completed++;
      
      if (completed === total) {
        res.json(results);
      }
    });
  }
});

// Keep the original simple education routes for backward compatibility
router.get('/', (req, res) => {
  db.all('SELECT * FROM education ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

router.post('/', (req, res) => {
  const { title, type, status, progress, start_date, target_date, notes } = req.body;
  
  db.run(
    `INSERT INTO education (title, type, status, progress, start_date, target_date, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, type, status || 'planned', progress || 0, start_date, target_date, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Education item created successfully' });
    }
  );
});

module.exports = router;