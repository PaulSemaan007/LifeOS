const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all career items
router.get('/', (req, res) => {
  db.all('SELECT * FROM career ORDER BY priority ASC, created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET career items by status
router.get('/status/:status', (req, res) => {
  db.all('SELECT * FROM career WHERE status=? ORDER BY priority ASC', req.params.status, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST new career item
router.post('/', (req, res) => {
  const { type, title, description, status, priority, target_date } = req.body;
  
  db.run(
    `INSERT INTO career (type, title, description, status, priority, target_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [type, title, description, status || 'active', priority || 3, target_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Career item created successfully' });
    }
  );
});

// PUT update career item
router.put('/:id', (req, res) => {
  const { type, title, description, status, priority, target_date } = req.body;
  
  db.run(
    `UPDATE career SET type=?, title=?, description=?, status=?, priority=?, target_date=? 
     WHERE id=?`,
    [type, title, description, status, priority, target_date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Career item updated successfully' });
    }
  );
});

// DELETE career item
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM career WHERE id=?', req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Career item deleted successfully' });
  });
});

module.exports = router;