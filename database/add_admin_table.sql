-- Add admin table to the database
USE sports_ecom;

CREATE TABLE IF NOT EXISTS admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Admin@123)
-- Hash was generated using bcryptjs with salt rounds = 10
INSERT INTO admin (email, name, password_hash) VALUES 
('admin@dbms.com', 'Admin', '$2b$10$6WYwvRulCJ46mmfkBUjvFO.2xH/czhs.pjROiom1wfapWkJBcq4JC');
