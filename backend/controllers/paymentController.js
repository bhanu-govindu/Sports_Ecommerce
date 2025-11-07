import db from '../config/db.js';

export const createPayment = (req, res) => {
  const { order_id, payment_method, amount } = req.body;
  const q = 'INSERT INTO payment (payment_method, amount, transaction_status, order_id) VALUES (?,?,?,?)';
  db.query(q, [payment_method, amount, 'completed', order_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query('UPDATE `order` SET status = ? WHERE order_id = ?', ['paid', order_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true });
    });
  });
};
