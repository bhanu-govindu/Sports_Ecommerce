import db from '../config/db.js';

export const createFeedback = (req, res) => {
  const { customer_id, order_id, message } = req.body;
  if (!customer_id || !message) return res.status(400).json({ error: 'customer_id and message are required' });
  const q = 'INSERT INTO feedback (customer_id, order_id, message, created_at) VALUES (?,?,?,NOW())';
  db.query(q, [customer_id, order_id || null, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ feedback_id: result.insertId });
  });
};

export const getAllFeedbacks = (req, res) => {
  const q = `SELECT f.feedback_id, f.customer_id, f.order_id, f.message, f.created_at, c.name AS customer_name, o.total_amount AS order_total
             FROM feedback f
             LEFT JOIN customer c ON f.customer_id = c.customer_id
             LEFT JOIN \`order\` o ON f.order_id = o.order_id
             ORDER BY f.created_at DESC`;
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows || []);
  });
};
