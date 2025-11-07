import db from '../config/db.js';

export const createReview = (req, res) => {
  const { product_id, customer_id, rating, comment } = req.body;
  const q = 'INSERT INTO review (rating, comment, product_id, customer_id) VALUES (?,?,?,?)';
  db.query(q, [rating, comment, product_id, customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ review_id: result.insertId });
  });
};
