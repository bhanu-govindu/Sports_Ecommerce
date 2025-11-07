import db from '../config/db.js';

export const createCustomer = (req, res) => {
  const { name, email, phone, address } = req.body;
  const q = `INSERT INTO customer (name, email, phone, address) VALUES (?, ?, ?, ?)`;
  db.query(q, [name, email, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    // return created customer row
    const id = result.insertId;
    db.query('SELECT * FROM customer WHERE customer_id = ?', [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(rows[0]);
    });
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

export const loginCustomer = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  db.query('SELECT * FROM customer WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(results[0]);
  });
};

export const updateCustomer = (req, res) => {
  const id = req.params.id;
  const { name, email, phone, address } = req.body;
  const q = 'UPDATE customer SET name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?';
  db.query(q, [name, email, phone, address, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query('SELECT * FROM customer WHERE customer_id = ?', [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0] || null);
    });
  });
};
