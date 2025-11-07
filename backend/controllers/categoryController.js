import db from '../config/db.js';

export const getAllCategories = (req, res) => {
  db.query('SELECT * FROM category ORDER BY category_name', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getCategoryById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM category WHERE category_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};
