import db from '../config/db.js';

export const createOrder = (req, res) => {
  const customerId = req.params.customerId;
  const conn = db;
  conn.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    connection.beginTransaction(errt => {
      if (errt) { connection.release(); return res.status(500).json({ error: errt.message }); }

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
};

function rollback(conn, res, err) {
  conn.rollback(() => {
    conn.release();
    console.error(err);
    res.status(400).json({ error: err.message || 'Transaction failed' });
  });
}
