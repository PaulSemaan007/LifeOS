const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all fitness records
router.get('/', (req, res) => {
  db.all('SELECT * FROM fitness ORDER BY date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET fitness stats by type
router.get('/stats', (req, res) => {
  db.all(`
    SELECT type, activity, COUNT(*) as sessions, AVG(value) as avg_value, unit
    FROM fitness 
    WHERE value IS NOT NULL
    GROUP BY type, activity, unit
    ORDER BY sessions DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ stats: rows });
  });
});

// POST new fitness record
router.post('/', (req, res) => {
  const { type, activity, value, unit, notes, date } = req.body;
  
  db.run(
    `INSERT INTO fitness (type, activity, value, unit, notes, date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [type, activity, value, unit, notes, date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Fitness record created successfully' });
    }
  );
});

// PUT update fitness record
router.put('/:id', (req, res) => {
  const { type, activity, value, unit, notes, date } = req.body;
  
  db.run(
    `UPDATE fitness SET type=?, activity=?, value=?, unit=?, notes=?, date=? 
     WHERE id=?`,
    [type, activity, value, unit, notes, date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Fitness record updated successfully' });
    }
  );
});

// DELETE fitness record
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM fitness WHERE id=?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    return;
    }
    res.json({ message: 'Fitness record deleted successfully' });
  });
});

module.exports = router;