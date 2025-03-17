-- Create database (if not already created by Docker environment variables)
CREATE DATABASE IF NOT EXISTS furniture_shop;
USE furniture_shop;

-- Create users table
CREATE TABLE users (
  uid CHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture LONGBLOB,
  address TEXT,
  tel VARCHAR(20),
  role VARCHAR(50) NOT NULL,
  logintype varchar(20) NOT NULL
);

-- Create producttype table
CREATE TABLE producttype (
  typeid int primary key auto_increment,
  typename varchar(50),
  typeimg LONGBLOB
);

-- Create products table
CREATE TABLE products (
  idproduct INT PRIMARY KEY AUTO_INCREMENT,
  productname VARCHAR(50),
  priceperunit DECIMAL(8,2), -- ราคาขาย
  costperunit DECIMAL(8,2), -- ราคาทุน
  detail VARCHAR(255),
  stockqtyfrontend INT,
  stockqtybackend INT,
  productimage LONGBLOB,
  typeid int,
  foreign key (typeid) references producttype (typeid)
);

-- Create cart table
CREATE TABLE cart(
  uid CHAR(50) NOT NULL,
  idproduct INT NOT NULL,
  quantity INT,
  isselect CHAR(1),
  PRIMARY KEY (uid, idproduct),
  FOREIGN KEY (uid) REFERENCES users(uid),
  FOREIGN KEY (idproduct) REFERENCES products(idproduct)
);

-- Insert product types
INSERT INTO producttype (typename) VALUES
  ('Living Room'),
  ('Bedroom'),
  ('Dining'),
  ('Office'),
  ('Outdoor'),
  ('Decor');

-- Update product type images
UPDATE producttype SET typeimg = 'asd';

-- Insert products
INSERT INTO products (productname, priceperunit, costperunit, detail, stockqtyfrontend, stockqtybackend, productimage, typeid) VALUES
  ('Sofa Set', 15000.00, 12000.00, 'Comfortable 3-seat sofa set', 10, 50, NULL, 1),
  ('Queen Bed', 12000.00, 9000.00, 'Modern queen-size bed', 8, 40, NULL, 2),
  ('Dining Table', 8500.00, 6000.00, 'Wooden dining table for 6 people', 5, 20, NULL, 3),
  ('Office Chair', 3200.00, 2500.00, 'Ergonomic office chair with adjustable height', 15, 60, NULL, 4),
  ('Outdoor Swing', 7000.00, 5000.00, 'Outdoor swing for garden and patio', 3, 15, NULL, 5),
  ('Wall Clock', 1200.00, 800.00, 'Decorative wall clock with wooden frame', 20, 100, NULL, 6);