package entities

// CREATE TABLE TransactionStatus (
//     IDStatus INT,
//     Name VARCHAR(20),
//     PRIMARY KEY (IDStatus)
// )

// CREATE TABLE TransactionLog (
//     IDTransaction INT NOT NULL,
//     Seq INT,
//     Timestamp Timestamp,
//     IDStatus INT NOT NULL,
//     IDAdmin INT,
//     PRIMARY KEY (IDTransaction,Seq),
//     FOREIGN KEY (IDStatus) REFERENCES TransactionStatus(IDStatus),
//     FOREIGN KEY (IDAdmin) REFERENCES ADMIN(IDADMIN)
// )

// CREATE TABLE Transaction(
//     IDTransaction INT PRIMARY KEY AUTO_INCREMENT,
//     TotalPrice DECIMAL(8,2),
//     Timestamp TIMESTAMP,
//     VAT DECIMAL(10,2),
//     IDCust INT NOT NULL,
//     IDStatus INT NOT NULL,
//     FOREIGN KEY (IDCust) REFERENCES Customer(IDCust),
//     FOREIGN KEY (IDStatus) REFERENCES TransactionStatus(IDStatus)
// );

// CREATE TABLE TransactionDetail (
//     IDtransaction INT NOT NULL,
//     Seq INT NOT NULL,
//     PRICE_NOVAT DECIMAL(8,2),
//     VAT DECIMAL(8,2),
//     QTY INT,
//     IDProduct INT NOT NULL,
//     PRIMARY KEY (IDtransaction, Seq),
//     FOREIGN KEY (IDtransaction) REFERENCES Transaction(IDtransaction),
//     FOREIGN KEY (IDProduct) REFERENCES Stock(IDProduct)
// );
