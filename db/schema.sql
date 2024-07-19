DROP TABLE IF EXISTS VAT;
CREATE TABLE VAT (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  percent DOUBLE UNIQUE NOT NULL
);

DROP TABLE IF EXISTS Product;
CREATE TABLE Product (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  type ENUM('marfa', 'serviciu') NOT NULL
);

DROP TABLE IF EXISTS Supplier;
CREATE TABLE Supplier (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS Client;
CREATE TABLE Client (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) UNIQUE NOT NULL,
  adresa      VARCHAR(255) NOT NULL,
  cif         VARCHAR(255) NOT NULL,
  punct_lucru VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Client_contract;
CREATE TABLE Client_contract (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  client_id  INT NOT NULL REFERENCES Client(id),
  licenta    VARCHAR(255) NOT NULL,
  buc        INT NOT NULL,
  pret       DOUBLE NOT NULL,
  tip        ENUM('permanent', 'sezonier') NOT NULL,
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  detalii    VARCHAR(255) NOT NULL,
  status     ENUM('acceptat', 'standby', 'respins', 'suspendat') NOT NULL DEFAULT('standby')
);

DROP TABLE IF EXISTS Factura;
CREATE TABLE Factura (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  price      DOUBLE NOT NULL,
  units      INT NOT NULL,
  vat_id     INT NOT NULL REFERENCES VAT(id),
  product_id INT NOT NULL REFERENCES Product(id)
);

DROP TABLE IF EXISTS Factura_intrare;
CREATE TABLE Factura_intrare (
  factura_id    INT PRIMARY KEY REFERENCES Factura(id),
  supplier_id   INT NOT NULL REFERENCES Supplier(id),
  supplier_name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Factura_iesire;
CREATE TABLE Factura_iesire (
  factura_id INT PRIMARY KEY REFERENCES Factura(id),
  client_id  INT NOT NULL REFERENCES Oferta(id),
  oferta_id  INT REFERENCES Supplier(id)
);

DROP TABLE IF EXISTS Plata;
CREATE TABLE Plata (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  factura_id INT NOT NULL REFERENCES Factura(id),
  value      DOUBLE NOT NULL,
  type       ENUM('card', 'numerar') NOT NULL,
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE())
);

CREATE VIEW Factura_VAT AS
SELECT 
  f.id AS id,
  f.data_ef AS data_ef,
  f.price AS price,
  f.units AS units,
  f.product_id AS product_id,
  
  (f.price * v.percent / 100) AS vat,
  (f.price + (f.price * v.percent / 100)) AS price_vat,
  (f.price * f.units) AS price_total,
  ((f.price + (f.price * v.percent / 100)) * f.units) AS price_vat_total
FROM Factura f
JOIN VAT v ON f.vat_id = v.id;

DROP TABLE IF EXISTS Oferta;
CREATE TABLE Oferta (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL REFERENCES Client(id),
  data_ef     DATE NOT NULL DEFAULT (CURRENT_DATE()),
  description VARCHAR(255) NOT NULL,
  details     VARCHAR(255),
  price       DOUBLE NOT NULL
);
