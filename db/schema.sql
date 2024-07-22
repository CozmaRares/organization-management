DROP TABLE IF EXISTS Produs;
CREATE TABLE Produs (
  nume VARCHAR(255) PRIMARY KEY,
  tip ENUM('marfa', 'serviciu') NOT NULL
);

DROP TABLE IF EXISTS Furnizor;
CREATE TABLE Furnizor (
  nume VARCHAR(255) NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS Client;
CREATE TABLE Client (
  nume        VARCHAR(255) NOT NULL PRIMARY KEY,
  adresa      VARCHAR(255) NOT NULL,
  cif         VARCHAR(255) NOT NULL,
  punct_lucru VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Contract_Client;
CREATE TABLE Contract_Client (
  nume_client  INT NOT NULL PRIMARY KEY REFERENCES Client(nume),
  licenta    VARCHAR(255) NOT NULL,
  buc        INT NOT NULL,
  pret       DOUBLE NOT NULL,
  tip        ENUM('permanent', 'sezonier') NOT NULL,
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  detalii    VARCHAR(255) NOT NULL,
  status     ENUM('acceptat', 'standby', 'respins', 'suspendat') NOT NULL DEFAULT('standby')
);

DROP TABLE IF EXISTS Factura_Intrare;
CREATE TABLE Factura_Intrare(
  id               INT AUTO_INCREMENT PRIMARY KEY,
  data_ef          DATE NOT NULL DEFAULT (CURRENT_DATE()),
  pret             DOUBLE NOT NULL,
  buc              INT NOT NULL,
  tva              DOUBLE NOT NULL DEFAULT 19,
  nume_produs      VARCHAR(255) REFERENCES Produs(nume),
  nume_furnizor    VARCHAR(255) NOT NULL REFERENCES Furnizor(nume),
  nume_la_furnizor VARCHAR(255) NOT NULL,
  tip              ENUM('marfa', 'cheltuiala') NOT NULL
);

DROP TABLE IF EXISTS Factura_Iesire;
CREATE TABLE Factura_Iesire (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  data_ef     DATE NOT NULL DEFAULT (CURRENT_DATE()),
  pret        DOUBLE NOT NULL,
  buc         INT NOT NULL,
  tva         DOUBLE NOT NULL DEFAULT 19,
  nume_client VARCHAR(255) NOT NULL REFERENCES Client(nume),
  nume_produs VARCHAR(255) NOT NULL REFERENCES Produs(nume),
  id_oferta   INT REFERENCES Oferta(id)
);

DROP TABLE IF EXISTS Plata;
CREATE TABLE Plata (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  id_factura INT NOT NULL, -- fk??
  valoare    DOUBLE NOT NULL,
  tip        ENUM('card', 'numerar') NOT NULL,
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  detalii    VARCHAR(1023) NOT NULL
);

DROP TABLE IF EXISTS Oferta;
CREATE TABLE Oferta (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  data_ef   DATE NOT NULL DEFAULT (CURRENT_DATE()),
  descriere VARCHAR(255) NOT NULL,
  detalii   VARCHAR(255),
  pret      DOUBLE NOT NULL
);
