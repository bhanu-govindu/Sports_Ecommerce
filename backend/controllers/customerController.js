import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createCustomer = async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const q = `INSERT INTO customer (name, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?)`;
    db.query(q, [name, email, phone, address, password_hash], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      // return created customer row (without password hash)
      const id = result.insertId;
      db.query('SELECT customer_id, name, email, phone, address FROM customer WHERE customer_id = ?', [id], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(rows[0]);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerById = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM customer WHERE customer_id = ?`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};

export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM customer WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Invalid email or password' });

    const customer = results[0];
    
    try {
      const isValid = await bcrypt.compare(password, customer.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Send customer data without password hash
      const { password_hash, ...customerData } = customer;
      res.json(customerData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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
