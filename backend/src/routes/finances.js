const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all finance records
router.get('/', (req, res) => {
  db.all('SELECT * FROM finances ORDER BY date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET finance summary (totals by type)
router.get('/summary', (req, res) => {
  db.all(`
    SELECT type, SUM(amount) as total, COUNT(*) as count 
    FROM finances 
    GROUP BY type
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ summary: rows });
  });
});

// POST new finance record
router.post('/', (req, res) => {
  const { type, category, amount, description, date } = req.body;
  
  db.run(
    `INSERT INTO finances (type, category, amount, description, date) 
     VALUES (?, ?, ?, ?, ?)`,
    [type, category, amount, description, date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Finance record created successfully' });
    }
  );
});

// PUT update finance record
router.put('/:id', (req, res) => {
  const { type, category, amount, description, date } = req.body;
  
  db.run(
    `UPDATE finances SET type=?, category=?, amount=?, description=?, date=? 
     WHERE id=?`,
    [type, category, amount, description, date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Finance record updated successfully' });
    }
  );
});

// DELETE finance record
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM finances WHERE id=?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Finance record deleted successfully' });
  });
});

module.exports = router;