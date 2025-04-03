-- Create database (if not already created by Docker environment variables)
CREATE DATABASE IF NOT EXISTS furniture_shop;
USE furniture_shop;

-- Create Table
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

CREATE TABLE producttype (
  typeid int primary key auto_increment,
  typename varchar(50),
  typeimg LONGBLOB
);

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

CREATE TABLE cart(
  uid CHAR(50) NOT NULL,
  idproduct INT NOT NULL,
  quantity INT,
  isselect CHAR(1),
  PRIMARY KEY (uid, idproduct),
  FOREIGN KEY (uid) REFERENCES users(uid),
  FOREIGN KEY (idproduct) REFERENCES products(idproduct)
);

CREATE TABLE admin(
    idadmin INT PRIMARY KEY AUTO_INCREMENT,
    adminname VARCHAR(50),
    password VARCHAR(256),
    tel VARCHAR(20)
);


CREATE TABLE transactionstatus (
    idstatus INT,
    name VARCHAR(20),
    PRIMARY KEY (idstatus)
)

CREATE TABLE transactionLog (
    idtransaction INT NOT NULL,
    seq INT,
    timestamp Timestamp,
    idstatus INT NOT NULL,
    idadmin INT,
    PRIMARY KEY (idtransaction,seq),
    FOREIGN KEY (idstatus) REFERENCES transactionstatus(idstatus),
    FOREIGN KEY (idadmin) REFERENCES ADMIN(idadmin)
)

CREATE TABLE transaction(
    idtransaction INT PRIMARY KEY AUTO_INCREMENT,
    totalprice DECIMAL(8,2),
    timestamp TIMESTAMP,
    vat DECIMAL(10,2),
    uid CHAR(50) NOT NULL,
    idstatus INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (idstatus) REFERENCES transactionstatus(idstatus)
);

CREATE TABLE transactiondetail (
    idtransaction INT NOT NULL,
    seq INT NOT NULL,
    price_novat DECIMAL(8,2),
    vat DECIMAL(8,2),
    qty INT,
    idproduct INT NOT NULL,
    PRIMARY KEY (idtransaction, seq),
    FOREIGN KEY (idtransaction) REFERENCES Transaction(idtransaction),
    FOREIGN KEY (idproduct) REFERENCES products(idproduct)
);

-- Create Procedures
DELIMITER //

CREATE PROCEDURE AddTransactionDetails(IN v_uid CHAR(50))
BEGIN
    DECLARE v_IDProduct INT;
    DECLARE v_Quantity INT;
    DECLARE v_IsSelect CHAR(1);
    DECLARE v_TransactionID INT;
    DECLARE v_TotalPrice DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_TotalVAT DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_CurStockQty INT;
    DECLARE v_PricePerUnit DECIMAL(10, 2);
    DECLARE v_NOVAT DECIMAL(10, 2);
    DECLARE v_VAT DECIMAL(10, 2);
    DECLARE v_Status INT;
    DECLARE v_Seq INT DEFAULT 1;
    DECLARE done INT DEFAULT 0;

    -- Cursor for iterating over selected cart items
    DECLARE cur CURSOR FOR
        SELECT idproduct, quantity, isselect
        FROM cart
        WHERE uid = v_uid;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    START TRANSACTION;

    OPEN cur;

    loop1: LOOP
        FETCH cur INTO v_IDProduct, v_Quantity, v_IsSelect;
        IF done = 1 THEN 
            LEAVE loop1;
        END IF;

        IF v_IsSelect = 'T' THEN
            SELECT priceperunit INTO v_PricePerUnit FROM products WHERE idproduct = v_IDProduct;
            SET v_TotalPrice = v_TotalPrice + (v_PricePerUnit * v_Quantity);
        END IF;
    END LOOP loop1;

    CLOSE cur;

    -- Insert into transaction
    SET v_Status = 1;
    INSERT INTO transaction (totalprice, timestamp, uid, idstatus)
    VALUES (v_TotalPrice, NOW(), v_uid, v_Status);

    -- Retrieve the last inserted transaction ID
    SET v_TransactionID = LAST_INSERT_ID();

    -- Reset cursor state
    SET done = 0;
    OPEN cur;

    loop2: LOOP
        FETCH cur INTO v_IDProduct, v_Quantity, v_IsSelect;
        IF done = 1 THEN 
            LEAVE loop2;
        END IF;

        IF v_IsSelect = 'T' THEN
            SELECT priceperunit, stockqtyfrontend INTO v_PricePerUnit, v_CurStockQty 
            FROM products 
            WHERE idproduct = v_IDProduct;

            -- VAT calculation
            SET v_NOVAT = v_PricePerUnit * (100 / 107);
            SET v_VAT = v_PricePerUnit * (7 / 107);

            -- Insert into transactionDetail
            INSERT INTO transactiondetail (idtransaction, seq, price_novat, qty, idproduct, vat)
            VALUES (
                v_TransactionID,
                v_Seq,
                ROUND(v_NOVAT * v_Quantity, 2),
                v_Quantity,
                v_IDProduct,
                ROUND(v_VAT * v_Quantity, 2)
            );

            -- Update product stock
            SET v_CurStockQty = v_CurStockQty - v_Quantity;
            UPDATE products SET stockqtyfrontend = v_CurStockQty WHERE idproduct = v_IDProduct;

            -- Update total VAT
            SET v_TotalVAT = v_TotalVAT + (v_VAT * v_Quantity);
            SET v_Seq = v_Seq + 1;
        END IF;
    END LOOP loop2;

    -- Update VAT in transaction
    UPDATE transaction SET vat = ROUND(v_TotalVAT, 2) WHERE idtransaction = v_TransactionID;

    -- Log transaction
    INSERT INTO transactionlog (idtransaction, seq, timestamp, idstatus, idadmin) 
    VALUES (v_TransactionID, 1, NOW(), 1, NULL);

    -- Clear purchased items from cart
    DELETE FROM cart WHERE isselect = 'T' AND uid = v_uid;

    CLOSE cur;
    COMMIT;
END
//
DELIMITER ;

DELIMITER //

CREATE OR REPLACE PROCEDURE UpdateTransactionStatus(
    IN p_IDTransaction INT,
    IN p_NewIDStatus INT,
    IN p_IDAdmin INT
)
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE old_IDStatus INT;
    DECLARE new_seq INT;
    DECLARE v_IDProduct INT;
    DECLARE v_QTY INT;

    -- Declare a cursor for fetching product details
    DECLARE cur CURSOR FOR
        SELECT IDProduct, QTY
        FROM TransactionDetail
        WHERE IDTransaction = p_IDTransaction;

    -- Continue handler for cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Start a transaction
    START TRANSACTION;

    -- Get the current transaction status
    SELECT IDStatus INTO old_IDStatus
    FROM Transaction
    WHERE IDTransaction = p_IDTransaction;

    -- Validate the status update
    IF ((p_NewIDStatus = old_IDStatus + 1 OR p_NewIDStatus = old_IDStatus - 1) OR (p_NewIDStatus = 6)) AND p_NewIDStatus <= 6 THEN
        -- Update transaction status
        UPDATE Transaction
        SET IDStatus = p_NewIDStatus
        WHERE IDTransaction = p_IDTransaction;

        -- Insert log entry
        SELECT IFNULL(MAX(Seq), 0) + 1 INTO new_seq
        FROM TransactionLog
        WHERE IDTransaction = p_IDTransaction;

        INSERT INTO TransactionLog (
            IDTransaction, Seq, Timestamp, IDStatus, IDAdmin
        )
        VALUES (
            p_IDTransaction, new_seq, NOW(), p_NewIDStatus, p_IDAdmin
        );

        -- Process stock updates if status is 5 or 6
        IF p_NewIDStatus IN (5, 6) THEN
            OPEN cur;
            stock_update_loop: LOOP
                FETCH cur INTO v_IDProduct, v_QTY;

                -- Exit loop when no rows are left
                IF done THEN
                    LEAVE stock_update_loop;
                END IF;

                -- Update stock quantities
                IF p_NewIDStatus = 5 THEN
                    UPDATE products
                    SET StockQtyBackEnd = StockQtyBackEnd - v_QTY
                    WHERE IDProduct = v_IDProduct;
                ELSEIF p_NewIDStatus = 6 THEN
                    UPDATE products
                    SET StockQtyFrontEnd = StockQtyFrontEnd + v_QTY
                    WHERE IDProduct = v_IDProduct;
                END IF;
            END LOOP;
            CLOSE cur;
        END IF;
    END IF;

    -- Commit the transaction
    COMMIT;
END//

DELIMITER ;

INSERT INTO transactionstatus VALUES
(1,"ยังไม่รับออเดอร์"),(2,"รับออเดอร์"),(3,"เริ่มแพคเกจ"),(4,"ส่งแพคเกจแล้ว"),(5,"ส่งให้ขนส่ง"),(6,"ยกเลิกออเดอร์")

INSERT INTO admin VALUES (1,"admin","admin","09215485");

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
