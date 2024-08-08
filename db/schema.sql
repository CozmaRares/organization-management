DROP TABLE IF EXISTS Produs;
CREATE TABLE Produs (
  nume VARCHAR(255) PRIMARY KEY,
  stoc INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS Furnizor;
CREATE TABLE Furnizor (
  nume VARCHAR(255) NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS Tip_Tranzactie;
CREATE TABLE Tip_Tranzactie (
  tip VARCHAR(255) PRIMARY KEY
);

DROP TABLE IF EXISTS Client;
CREATE TABLE Client (
  nume   VARCHAR(255) NOT NULL PRIMARY KEY,
  adresa VARCHAR(255) NOT NULL,
  cif    VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Contract_Client;
CREATE TABLE Contract_Client (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nume_client VARCHAR(255) NOT NULL REFERENCES Client(nume),
  data_ef     DATE NOT NULL DEFAULT (CURRENT_DATE()),
  detalii     VARCHAR(255) NOT NULL,
  status      ENUM('acceptat', 'standby', 'respins', 'suspendat') NOT NULL DEFAULT('standby')
);

DROP TABLE IF EXISTS Licenta_Contract_Client;
CREATE TABLE Licenta_Contract_Client (
  id_contract INT PRIMARY KEY REFERENCES Contract_Client(id),
  licenta     VARCHAR(255) NOT NULL,
  buc         INT NOT NULL,
  pret        DOUBLE NOT NULL,
  tip         ENUM('permanent', 'sezonier') NOT NULL
);

DROP TABLE IF EXISTS Factura_Intrare;
CREATE TABLE Factura_Intrare(
  id            INT AUTO_INCREMENT PRIMARY KEY,
  data_ef       DATE NOT NULL DEFAULT (CURRENT_DATE()),
  nume_furnizor VARCHAR(255) NOT NULL REFERENCES Furnizor(nume)
);

DROP TABLE IF EXISTS Marfa_Factura_Intrare;
CREATE TABLE Marfa_Factura_Intrare (
  id_factura       INT REFERENCES Factura_Intrare(id),
  nume_produs      VARCHAR(255) REFERENCES Produs(nume),
  nume_la_furnizor VARCHAR(255) NOT NULL,
  buc              INT NOT NULL,
  pret             DOUBLE NOT NULL,
  tva              INT NOT NULL DEFAULT 19,

  PRIMARY KEY (id_factura, nume_produs)
);

DROP TABLE IF EXISTS Cheltuiala_Factura_Intrare;
CREATE TABLE Cheltuiala_Factura_Intrare (
  id_factura      INT REFERENCES Factura_Intrare(id),
  nume_cheltuiala VARCHAR(255),
  pret            DOUBLE NOT NULL,
  tva             INT NOT NULL DEFAULT 19,

  PRIMARY KEY (id_factura, nume_cheltuiala)
);

DROP TABLE IF EXISTS Plata;
CREATE TABLE Plata (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  id_factura INT NOT NULL REFERENCES Factura_Intrare(id),
  valoare    DOUBLE NOT NULL,
  tip        VARCHAR(255) NOT NULL REFERENCES Tip_Tranzactie(tip),
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  detalii    VARCHAR(1023) NOT NULL
);

DROP TABLE IF EXISTS Factura_Iesire;
CREATE TABLE Factura_Iesire (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  data_emisa    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  data_scadenta DATE NOT NULL DEFAULT (CURRENT_DATE()),
  nume_client   VARCHAR(255) NOT NULL REFERENCES Client(nume),
  reducere      INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS Marfa_Factura_Iesire;
CREATE TABLE Marfa_Factura_Iesire (
  id_factura  INT REFERENCES Factura_Iesire(id),
  nume_produs VARCHAR(255) REFERENCES Produs(nume),
  buc         INT NOT NULL,
  pret        DOUBLE NOT NULL,
  tva         INT NOT NULL DEFAULT 19,
  reducere    INT NOT NULL DEFAULT 0,

  PRIMARY KEY (id_factura, nume_produs)
);

DROP TABLE IF EXISTS Serviciu_Factura_Iesire;
CREATE TABLE Serviciu_Factura_Iesire (
  id_factura    INT REFERENCES Factura_Iesire(id),
  nume_serviciu VARCHAR(255),
  pret          DOUBLE NOT NULL,
  tva           INT NOT NULL DEFAULT 19,

  PRIMARY KEY (id_factura, nume_serviciu)
);

DROP TABLE IF EXISTS Incasare;
CREATE TABLE Incasare (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  id_factura INT NOT NULL REFERENCES Factura_Intrare(id),
  valoare    DOUBLE NOT NULL,
  tip        VARCHAR(255) NOT NULL REFERENCES Tip_Tranzactie(tip),
  data_ef    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  document   VARCHAR(255) NOT NULL,
  detalii    VARCHAR(1023) NOT NULL,
  status     ENUM('emisă', 'în procesare', 'eșuată', 'completă')
);
