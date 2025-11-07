import db from '../config/db.js';

export const getAllProducts = (req, res) => {
  // support optional filters: sport_type, category_id, search
  const { sport_type, category_id, search } = req.query;
  let q = `SELECT p.*, c.category_name FROM product p LEFT JOIN category c ON p.category_id = c.category_id`;
  const params = [];
  const filters = [];
  if (sport_type) { filters.push('LOWER(p.sport_type) = LOWER(?)'); params.push(sport_type); }
  if (category_id) { filters.push('p.category_id = ?'); params.push(category_id); }
  if (search) { filters.push('LOWER(p.product_name) LIKE ?'); params.push(`%${search.toLowerCase()}%`); }
  if (filters.length) q += ' WHERE ' + filters.join(' AND ');
  db.query(q, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getProductById = (req, res) => {
  const id = req.params.id;
  const q = `SELECT p.*, c.category_name FROM product p LEFT JOIN category c ON p.category_id = c.category_id WHERE p.product_id = ?`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: 'Product not found' });
    const product = results[0];
    const rq = `SELECT r.*, cu.name AS customer_name FROM review r JOIN customer cu ON r.customer_id = cu.customer_id WHERE r.product_id = ? ORDER BY r.review_date DESC`;
    db.query(rq, [id], (err2, reviews) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ product, reviews });
    });
  });
};

export const addProduct = (req, res) => {
  const { product_name, description, price, stock_quantity, sport_type, brand, category_id, supplier_id } = req.body;
  const q = `INSERT INTO product (product_name, description, price, stock_quantity, sport_type, brand, category_id, supplier_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(q, [product_name, description, price, stock_quantity, sport_type, brand, category_id || null, supplier_id || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ product_id: result.insertId });
  });
};
