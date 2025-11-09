USE sports_ecom;

DROP PROCEDURE IF EXISTS sp_checkout_cart;
DROP PROCEDURE IF EXISTS sp_restock_low_inventory;
DROP PROCEDURE IF EXISTS sp_apply_category_discount;

DELIMITER $$
-- Stored Procedures (>=3) including a cursor and exception handling

-- Checkout a customer's cart into a new order using a cursor over cart_item
CREATE PROCEDURE sp_checkout_cart(
  IN p_customer_id INT,
  OUT p_order_id INT
)
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_cart_id INT;
  DECLARE v_product_id INT;
  DECLARE v_quantity INT;
  DECLARE v_unit_price DECIMAL(10,2);

  DECLARE cur CURSOR FOR
    SELECT ci.product_id, ci.quantity
      FROM cart c
      JOIN cart_item ci ON ci.cart_id = c.cart_id
     WHERE c.customer_id = p_customer_id
     ORDER BY ci.cart_item_id;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1; -- cursor exhausted

  -- Roll back on any SQL error
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Checkout failed. Transaction rolled back.';
  END;

  START TRANSACTION;

  -- Ensure a cart exists and fetch it
  SELECT cart_id INTO v_cart_id FROM cart WHERE customer_id = p_customer_id FOR UPDATE;
  IF v_cart_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No cart for customer';
  END IF;

  -- Create order (total will be recomputed by triggers)
  INSERT INTO `order`(order_date, total_amount, status, customer_id)
  VALUES (NOW(), 0.00, 'pending', p_customer_id);
  SET p_order_id = LAST_INSERT_ID();

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO v_product_id, v_quantity;
    IF done = 1 THEN
      LEAVE read_loop;
    END IF;

    -- Determine price at time of order
    SELECT price INTO v_unit_price FROM product WHERE product_id = v_product_id FOR UPDATE;
    IF v_unit_price IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found during checkout';
    END IF;

    -- Insert order item; triggers will validate stock, set price if needed, decrement stock, and update total
    INSERT INTO order_item(order_id, product_id, quantity, unit_price)
    VALUES (p_order_id, v_product_id, v_quantity, v_unit_price);
  END LOOP;
  CLOSE cur;

  -- Empty the cart after successful creation
  DELETE ci FROM cart_item ci WHERE ci.cart_id = v_cart_id;

  -- Optionally set status to paid outside this proc after payment
  COMMIT;
END $$

-- Restock products below a threshold by a fixed amount
CREATE PROCEDURE sp_restock_low_inventory(
  IN p_threshold INT,
  IN p_restock_amount INT,
  OUT p_updated_count INT
)
BEGIN
  DECLARE v_id INT;
  DECLARE done INT DEFAULT 0;
  DECLARE cur CURSOR FOR SELECT product_id FROM product WHERE stock_quantity < p_threshold FOR UPDATE;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Restock failed. Transaction rolled back.';
  END;

  SET p_updated_count = 0;
  START TRANSACTION;

  OPEN cur;
  restock_loop: LOOP
    FETCH cur INTO v_id;
    IF done = 1 THEN LEAVE restock_loop; END IF;

    UPDATE product
       SET stock_quantity = stock_quantity + p_restock_amount
     WHERE product_id = v_id;

    SET p_updated_count = p_updated_count + ROW_COUNT();
  END LOOP;
  CLOSE cur;

  COMMIT;
END $$


DELIMITER ;