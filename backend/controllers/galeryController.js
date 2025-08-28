const db = require('../config/db');

exports.getAllGalery = (req, res) => {
  db.query('SELECT * FROM galery', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createGalery = (req, res) => {
  const { post_id, position, status } = req.body;
  db.query(
    'INSERT INTO galery (post_id, position, status) VALUES (?, ?, ?)',
    [post_id, position, status],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, post_id, position, status });
    }
  );
};

exports.getGaleryById = (req, res) => {
  db.query('SELECT * FROM galery WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Galery not found' });
    res.json(results[0]);
  });
};

exports.updateGalery = (req, res) => {
  const { post_id, position, status } = req.body;
  db.query(
    'UPDATE galery SET post_id = ?, position = ?, status = ? WHERE id = ?',
    [post_id, position, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Galery updated' });
    }
  );
};

exports.deleteGalery = (req, res) => {
  db.query('DELETE FROM galery WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Galery deleted' });
  });
};
