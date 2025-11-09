USE sports_ecom;

-- Add image_url column to product table if it doesn't exist
ALTER TABLE product ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE SET NULL
);
