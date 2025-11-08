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

-- Additional categories for more sports
INSERT INTO category (category_name, description) VALUES
('Cricket','Cricket specific gear'),
('Football','Football specific gear'),
('Basketball','Basketball gear and balls'),
('Tennis','Rackets and strings'),
('Cycling','Bikes and helmets'),
('Swimming','Swimwear and goggles'),
('Badminton','Rackets and shuttlecocks'),
('Hockey','Hockey sticks and pads'),
('Gym & Fitness','Weights, mats and accessories'),
('Accessories','Bottles, bags, caps');

-- Additional suppliers
INSERT INTO supplier (supplier_name, contact_person, phone, email, address)
VALUES
('ProSports','Ravi Sharma','8888888888','ravi@prosports.com','Mumbai, India'),
('AceGear','Sunita Rao','7777777777','sunita@acegear.com','Bengaluru, India'),
('CycleWorld','Karan Mehta','6666666666','karan@cycleworld.com','Pune, India');

-- More products across categories and sports
INSERT INTO product (product_name, description, price, stock_quantity, sport_type, brand, category_id, supplier_id)
VALUES
('Cricket Pads','Protective batting pads',2299.00,25,'Cricket','SafeGuard',4,2),
('Leather Football','Official size 5 football',1799.00,40,'Football','ProKick',5,2),
('Basketball','Indoor/outdoor basketball',1499.00,35,'Basketball','HoopStar',6,2),
('Tennis Racket','Graphite tennis racket, 300g',5499.00,15,'Tennis','SpinAce',7,2),
('Road Helmet','Lightweight cycling helmet',3499.00,20,'Cycling','CycleSafe',8,3),
('Road Bike - Alloy','21 speed road bike',24999.00,5,'Cycling','CycleWorld',8,3),
('Swim Goggles','Anti-fog swim goggles',499.00,60,'Swimming','AquaClear',9,3),
('Badminton Racket','Carbon fiber racket',2999.00,22,'Badminton','ShuttlePro',10,2),
('Hockey Stick','Composite hockey stick',3999.00,18,'Hockey','StickMaster',11,2),
('Dumbbell Set 20kg','Adjustable dumbbell set',3999.00,12,'Gym','FitCore',12,2),
('Yoga Mat','Non-slip yoga mat',999.00,50,'Gym','ZenFlex',12,1),
('Sports Water Bottle','1L insulated bottle',499.00,120,'Accessories','HydroFit',13,1),
('Sport Cap','Breathable running cap',299.00,80,'Accessories','CapZone',13,1);

INSERT INTO customer (name,email,phone,address) VALUES ('Test User','test@example.com','9876543210','Gujarat, India');
