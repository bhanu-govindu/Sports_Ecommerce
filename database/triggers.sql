USE sports_ecom;

-- Drop existing objects to make script re-runnable
DROP TRIGGER IF EXISTS trg_order_item_bi_validate_set_price;
DROP TRIGGER IF EXISTS trg_order_item_ai_decrement_stock_update_total;
DROP TRIGGER IF EXISTS trg_order_item_au_adjust_stock_update_total;
DROP TRIGGER IF EXISTS trg_order_item_ad_restock_update_total;

DELIMITER $$
-- Triggers
-- 1) Before insert on order_item: validate quantity, check stock, default unit_price from product
CREATE TRIGGER trg_order_item_bi_validate_set_price
BEFORE INSERT ON order_item
FOR EACH ROW
BEGIN
  DECLARE v_stock INT;
  DECLARE v_price DECIMAL(10,2);

  IF NEW.quantity IS NULL OR NEW.quantity <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be positive';
  END IF;

  -- Lock product row to validate stock/price consistently
  SELECT stock_quantity, price INTO v_stock, v_price
    FROM product
   WHERE product_id = NEW.product_id
   FOR UPDATE;

  IF v_stock IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
  END IF;

  IF v_stock < NEW.quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for product';
  END IF;

  IF NEW.unit_price IS NULL OR NEW.unit_price <= 0 THEN
    SET NEW.unit_price = v_price;
  END IF;
END $$

-- 2) After insert on order_item: decrement stock and refresh order total
CREATE TRIGGER trg_order_item_ai_decrement_stock_update_total
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
  UPDATE product
     SET stock_quantity = stock_quantity - NEW.quantity
   WHERE product_id = NEW.product_id;

  UPDATE `order`
     SET total_amount = fn_order_total(NEW.order_id)
   WHERE order_id = NEW.order_id;
END $$

-- 3) After update on order_item: adjust stock by delta and refresh total
CREATE TRIGGER trg_order_item_au_adjust_stock_update_total
AFTER UPDATE ON order_item
FOR EACH ROW
BEGIN
  -- If product changed, reverse old stock and apply new
  IF OLD.product_id <> NEW.product_id THEN
    UPDATE product
       SET stock_quantity = stock_quantity + OLD.quantity
     WHERE product_id = OLD.product_id;

    UPDATE product
       SET stock_quantity = stock_quantity - NEW.quantity
     WHERE product_id = NEW.product_id;
  ELSE
    -- Same product: adjust by quantity delta
    UPDATE product
       SET stock_quantity = stock_quantity - (NEW.quantity - OLD.quantity)
     WHERE product_id = NEW.product_id;
  END IF;

  -- Update totals for possibly changed order
  UPDATE `order`
     SET total_amount = fn_order_total(NEW.order_id)
   WHERE order_id = NEW.order_id;

  IF OLD.order_id <> NEW.order_id THEN
    UPDATE `order`
       SET total_amount = fn_order_total(OLD.order_id)
     WHERE order_id = OLD.order_id;
  END IF;
END $$

-- 4) After delete on order_item: restock and refresh order total
CREATE TRIGGER trg_order_item_ad_restock_update_total
AFTER DELETE ON order_item
FOR EACH ROW
BEGIN
  UPDATE product
     SET stock_quantity = stock_quantity + OLD.quantity
   WHERE product_id = OLD.product_id;

  UPDATE `order`
     SET total_amount = fn_order_total(OLD.order_id)
   WHERE order_id = OLD.order_id;
END $$

DELIMITER ;
