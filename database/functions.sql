USE sports_ecom;

DROP FUNCTION IF EXISTS fn_order_total;
DROP FUNCTION IF EXISTS fn_stock_level;

DELIMITER $$


-- Functions
CREATE FUNCTION fn_order_total(p_order_id INT)
RETURNS DECIMAL(12,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_total DECIMAL(12,2);
  SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0.00)
    INTO v_total
    FROM order_item oi
   WHERE oi.order_id = p_order_id;
  RETURN IFNULL(v_total, 0.00);
END $$

CREATE FUNCTION fn_stock_level(p_product_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_stock INT;
  SELECT stock_quantity INTO v_stock FROM product WHERE product_id = p_product_id;
  RETURN IFNULL(v_stock, 0);
END $$

DELIMITER ;