USE sports_ecom;

ALTER TABLE customer 
ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';