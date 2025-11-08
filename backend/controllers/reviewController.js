import db from '../config/db.js';

export const createReview = (req, res) => {
  const { product_id, customer_id, rating, comment } = req.body;
  const q = 'INSERT INTO review (rating, comment, product_id, customer_id) VALUES (?,?,?,?)';
  db.query(q, [rating, comment, product_id, customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ review_id: result.insertId });
  });
};

export const getAllReviews = (req, res) => {
  const q = `SELECT r.review_id, r.rating, r.comment, r.review_date, r.product_id, p.product_name, r.customer_id, c.name AS customer_name
             FROM review r
             LEFT JOIN customer c ON r.customer_id = c.customer_id
             LEFT JOIN product p ON r.product_id = p.product_id
             ORDER BY r.review_date DESC`;
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows || []);
  });
};
