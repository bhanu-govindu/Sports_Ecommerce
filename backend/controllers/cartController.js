import db from '../config/db.js';

export const getCartForCustomer = (req, res) => {
  const customerId = req.params.customerId;
  db.query('SELECT * FROM cart WHERE customer_id = ?', [customerId], (err, carts) => {
    if (err) return res.status(500).json({ error: err.message });
    if (carts.length === 0) {
      db.query('INSERT INTO cart (customer_id) VALUES (?)', [customerId], (err2, r) => {
        if (err2) return res.status(500).json({ error: err2.message });
        const cartId = r.insertId;
        db.query('SELECT * FROM cart WHERE cart_id = ?', [cartId], (err3, newc) => {
          if (err3) return res.status(500).json({ error: err3.message });
          getCartItemsAndReturn(newc[0], res);
        });
      });
    } else {
      getCartItemsAndReturn(carts[0], res);
    }
  });
};

function getCartItemsAndReturn(cart, res) {
  db.query(
    `SELECT ci.cart_item_id, ci.product_id, ci.quantity, p.product_name, p.price, p.stock_quantity
     FROM cart_item ci JOIN product p ON ci.product_id = p.product_id WHERE ci.cart_id = ?`,
    [cart.cart_id],
    (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ cart, items });
    }
  );
}

export const addToCart = (req, res) => {
  const customerId = req.params.customerId;
  const { product_id, quantity } = req.body;
  const qty = Number(quantity) || 1;
  db.query('SELECT * FROM cart WHERE customer_id = ?', [customerId], (err, carts) => {
    if (err) return res.status(500).json({ error: err.message });
    if (carts.length === 0) {
      db.query('INSERT INTO cart (customer_id) VALUES (?)', [customerId], (err2, r) => {
        if (err2) return res.status(500).json({ error: err2.message });
        const cartId = r.insertId;
        upsertCartItem(cartId, product_id, qty, res);
      });
    } else {
      const cartId = carts[0].cart_id;
      upsertCartItem(cartId, product_id, qty, res);
    }
  });
};

function upsertCartItem(cartId, product_id, qty, res) {
  db.query('SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?', [cartId, product_id], (err, exists) => {
    if (err) return res.status(500).json({ error: err.message });
    if (exists.length > 0) {
      db.query('UPDATE cart_item SET quantity = quantity + ? WHERE cart_item_id = ?', [qty, exists[0].cart_item_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true });
      });
    } else {
      db.query('INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?,?,?)', [cartId, product_id, qty], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true });
      });
    }
  });
}

export const removeFromCart = (req, res) => {
  const { cart_item_id } = req.body;
  db.query('DELETE FROM cart_item WHERE cart_item_id = ?', [cart_item_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
};
