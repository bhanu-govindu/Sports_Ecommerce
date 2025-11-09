import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM admin WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Invalid email or password' });

    const admin = results[0];
    
    try {
      const isValid = await bcrypt.compare(password, admin.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Send admin data without password hash
      const { password_hash, ...adminData } = admin;
      res.json(adminData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

export const getAdminById = (req, res) => {
  const id = req.params.id;
  const q = `SELECT admin_id, email, name, created_at, updated_at FROM admin WHERE admin_id = ?`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};

export const getAllAdmins = (req, res) => {
  const q = `SELECT admin_id, email, name, created_at, updated_at FROM admin`;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
};

export const createAdmin = async (req, res) => {
  const { email, name, password } = req.body;
  
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const q = `INSERT INTO admin (email, name, password_hash) VALUES (?, ?, ?)`;
    db.query(q, [email, name, password_hash], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      const id = result.insertId;
      db.query('SELECT admin_id, email, name, created_at FROM admin WHERE admin_id = ?', [id], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(rows[0]);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  const id = req.params.id;
  const { email, name, password } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    if (password) {
      // Update with new password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      const q = 'UPDATE admin SET email = ?, name = ?, password_hash = ? WHERE admin_id = ?';
      db.query(q, [email, name, password_hash, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query('SELECT admin_id, email, name, created_at, updated_at FROM admin WHERE admin_id = ?', [id], (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(rows[0] || null);
        });
      });
    } else {
      // Update without password
      const q = 'UPDATE admin SET email = ?, name = ? WHERE admin_id = ?';
      db.query(q, [email, name, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query('SELECT admin_id, email, name, created_at, updated_at FROM admin WHERE admin_id = ?', [id], (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(rows[0] || null);
        });
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
