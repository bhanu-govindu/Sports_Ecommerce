import db from '../config/db.js';

export const createOrder = (req, res) => {
  const customerId = req.params.customerId;
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    connection.beginTransaction(errt => {
      if (errt) { connection.release(); return res.status(500).json({ error: errt.message }); }
      const { billingAddress } = req.body;
      if (!billingAddress || String(billingAddress).trim() === '') return res.status(400).json({ error: 'Billing address is required to place an order' });

      // persist billing address on customer record first (inside transaction)
      connection.query('UPDATE customer SET address = ? WHERE customer_id = ?', [billingAddress, customerId], (errUpd) => {
        if (errUpd) return rollback(connection, res, errUpd);

        connection.query('SELECT * FROM cart WHERE customer_id = ?', [customerId], (err1, carts) => {
          if (err1) return rollback(connection, res, err1);
          if (carts.length === 0) return rollback(connection, res, new Error('Cart not found'));
          const cartId = carts[0].cart_id;

          connection.query('SELECT ci.*, p.price, p.stock_quantity FROM cart_item ci JOIN product p ON ci.product_id = p.product_id WHERE ci.cart_id = ?', [cartId], (err2, items) => {
            if (err2) return rollback(connection, res, err2);
            if (items.length === 0) return rollback(connection, res, new Error('Cart is empty'));

            let total = 0;
            for (const it of items) {
              total += Number(it.price) * Number(it.quantity);
              if (it.quantity > it.stock_quantity) return rollback(connection, res, new Error(`Product ${it.product_id} insufficient stock`));
            }

            connection.query('INSERT INTO `order` (order_date, total_amount, status, customer_id) VALUES (NOW(), ?, ?, ?)', [total, 'processing', customerId], (err3, orderRes) => {
              if (err3) return rollback(connection, res, err3);
              const orderId = orderRes.insertId;

              const insertPromises = items.map(it => {
                return new Promise((resolve, reject) => {
                  connection.query('INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES (?,?,?,?)', [orderId, it.product_id, it.quantity, it.price], (e) => {
                    if (e) return reject(e);
                    connection.query('UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?', [it.quantity, it.product_id], (e2) => {
                      if (e2) return reject(e2);
                      resolve();
                    });
                  });
                });
              });

              Promise.all(insertPromises).then(() => {
                connection.query('DELETE FROM cart_item WHERE cart_id = ?', [cartId], (err4) => {
                  if (err4) return rollback(connection, res, err4);
                  connection.commit((cmErr) => {
                    if (cmErr) return rollback(connection, res, cmErr);
                    connection.release();
                    res.json({ success: true, order_id: orderId });
                  });
                });
              }).catch(errP => rollback(connection, res, errP));
            });
          });
        });
      });
    });
  });
};

function rollback(conn, res, err) {
  conn.rollback(() => {
    conn.release();
    console.error(err);
    res.status(400).json({ error: err.message || 'Transaction failed' });
  });
}

// Admin: list all orders
export const getAllOrders = (req, res) => {
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    const sql = `SELECT o.order_id, o.order_date, o.total_amount AS total, o.status, o.customer_id, c.name AS customer_name
                 FROM \`order\` o
                 LEFT JOIN customer c ON o.customer_id = c.customer_id
                 ORDER BY o.order_date DESC`;
    connection.query(sql, (errQ, rows) => {
      connection.release();
      if (errQ) return res.status(500).json({ error: errQ.message });
      return res.json(rows);
    });
  });
};

// Admin: update order status
export const updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    connection.query('UPDATE `order` SET status = ? WHERE order_id = ?', [status, orderId], (errU, result) => {
      connection.release();
      if (errU) return res.status(500).json({ error: errU.message });
      return res.json({ success: true });
    });
  });
};

// Get order by id including items
export const getOrderById = (req, res) => {
  const { orderId } = req.params;
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    const q1 = `SELECT o.order_id, o.order_date, o.total_amount AS total, o.status, o.customer_id, c.name AS customer_name, c.email
                FROM \`order\` o LEFT JOIN customer c ON o.customer_id = c.customer_id WHERE o.order_id = ?`;
    connection.query(q1, [orderId], (errO, rows) => {
      if (errO) { connection.release(); return res.status(500).json({ error: errO.message }); }
      if (!rows || rows.length === 0) { connection.release(); return res.status(404).json({ error: 'Order not found' }); }
      const order = rows[0];
      const q2 = `SELECT oi.*, p.product_name, p.image_url FROM order_item oi JOIN product p ON oi.product_id = p.product_id WHERE oi.order_id = ?`;
      connection.query(q2, [orderId], (errI, items) => {
        connection.release();
        if (errI) return res.status(500).json({ error: errI.message });
        order.items = items || [];
        return res.json(order);
      });
    });
  });
};

// Get orders for a customer (with items) - used to determine delivered orders for review eligibility
export const getOrdersByCustomer = (req, res) => {
  const { customerId } = req.params;
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    const q = `SELECT o.order_id, o.order_date, o.total_amount AS total, o.status
               FROM \`order\` o WHERE o.customer_id = ? ORDER BY o.order_date DESC`;
    connection.query(q, [customerId], (errO, orders) => {
      if (errO) { connection.release(); return res.status(500).json({ error: errO.message }); }
      const orderIds = (orders || []).map(o => o.order_id);
      if (orderIds.length === 0) { connection.release(); return res.json([]); }
      const q2 = `SELECT oi.order_id, oi.product_id, oi.quantity, p.product_name FROM order_item oi JOIN product p ON oi.product_id = p.product_id WHERE oi.order_id IN (${orderIds.join(',')})`;
      connection.query(q2, (errI, items) => {
        connection.release();
        if (errI) return res.status(500).json({ error: errI.message });
        const itemsByOrder = {};
        (items || []).forEach(it => { itemsByOrder[it.order_id] = itemsByOrder[it.order_id] || []; itemsByOrder[it.order_id].push(it) });
        const resOrders = orders.map(o => ({ ...o, items: itemsByOrder[o.order_id] || [] }));
        return res.json(resOrders);
      });
    });
  });
};
