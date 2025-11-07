import db from '../config/db.js';

export const createCustomer = (req, res) => {
  const { name, email, phone, address } = req.body;
  const q = `INSERT INTO customer (name, email, phone, address) VALUES (?, ?, ?, ?)`;
  db.query(q, [name, email, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ customer_id: result.insertId });
  });
};

export const getCustomerById = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM customer WHERE customer_id = ?`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};
