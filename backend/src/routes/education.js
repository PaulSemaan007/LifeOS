const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all education items
router.get('/', (req, res) => {
  db.all('SELECT * FROM education ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST new education item
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

// PUT update education item
router.put('/:id', (req, res) => {
  const { title, type, status, progress, start_date, target_date, notes } = req.body;
  
  db.run(
    `UPDATE education SET title=?, type=?, status=?, progress=?, start_date=?, target_date=?, notes=? 
     WHERE id=?`,
    [title, type, status, progress, start_date, target_date, notes, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Education item updated successfully' });
    }
  );
});

// DELETE education item
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM education WHERE id=?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Education item deleted successfully' });
  });
});

module.exports = router;