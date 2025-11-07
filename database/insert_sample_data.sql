USE sports_ecom;

INSERT INTO category (category_name, description) VALUES 
('Footwear','Shoes and cleats'),
('Apparel','Clothing'),
('Equipment','Gear');

INSERT INTO supplier (supplier_name, contact_person, phone, email, address)
VALUES ('SportHouse','Amit Patel','9999999999','amit@sporthouse.com','Surat, India');

INSERT INTO product (product_name, description, price, stock_quantity, sport_type, brand, category_id, supplier_id)
VALUES 
('Running Shoes','Lightweight running shoes',2499.00,20,'Running','FastRun',1,1),
('Cricket Bat','English willow bat',8999.00,10,'Cricket','BatMaster',3,1),
('Football Jersey','Team jersey size M',1299.00,30,'Football','KickPro',2,1);

INSERT INTO customer (name,email,phone,address) VALUES ('Test User','test@example.com','9876543210','Gujarat, India');
