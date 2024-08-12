DROP TABLE IF EXISTS Produs;
CREATE TABLE Produs (
  nume VARCHAR(255) PRIMARY KEY,

  stoc INT NOT NULL DEFAULT 0,

  CHECK (stoc >= 0)
);

DROP TABLE IF EXISTS Furnizor;
CREATE TABLE Furnizor (
  nume VARCHAR(255) PRIMARY KEY,

  status ENUM('activ', 'suspendat', 'anulat') NOT NULL DEFAULT ('activ')
);

DROP TABLE IF EXISTS Tip_Tranzactie;
CREATE TABLE Tip_Tranzactie (
  tip VARCHAR(255) PRIMARY KEY
);

DROP TABLE IF EXISTS Client;
CREATE TABLE Client (
  nume VARCHAR(255) PRIMARY KEY,

  cif    VARCHAR(255) NOT NULL,
  adresa VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Contract_Client;
CREATE TABLE Contract_Client (
  id INT PRIMARY KEY AUTO_INCREMENT,

  nume_client VARCHAR(255) NOT NULL REFERENCES Client(nume),

  data_ef DATE                                                NOT NULL DEFAULT (CURRENT_DATE()),
  status  ENUM('acceptat', 'standby', 'respins', 'suspendat') NOT NULL DEFAULT ('standby'),

  detalii VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Licenta_Contract_Client;
CREATE TABLE Licenta_Contract_Client (
  id_contract INT PRIMARY KEY REFERENCES Contract_Client(id),

  buc     INT            NOT NULL,
  pret    DECIMAL(10, 2) NOT NULL,

  licenta VARCHAR(255)                  NOT NULL,
  tip     ENUM('permanent', 'sezonier') NOT NULL,

  CHECK (buc > 0 AND pret > 0)
);

DROP TABLE IF EXISTS Factura_Intrare;
CREATE TABLE Factura_Intrare(
  id INT AUTO_INCREMENT PRIMARY KEY,

  nume_furnizor VARCHAR(255) NOT NULL REFERENCES Furnizor(nume),

  data_ef DATE NOT NULL DEFAULT (CURRENT_DATE())
);

DROP TABLE IF EXISTS Marfa_Intrare;
CREATE TABLE Marfa_Intrare (
  id_factura  INT          REFERENCES Factura_Intrare(id),
  nume_produs VARCHAR(255) REFERENCES Produs(nume),

  tva  INT            NOT NULL DEFAULT 19,
  buc  DECIMAL(10, 2) NOT NULL,
  pret DECIMAL(10, 2) NOT NULL,

  nume_la_furnizor VARCHAR(255) NOT NULL,

  PRIMARY KEY (id_factura, nume_produs),

  CHECK (tva >= 0 AND buc > 0 AND pret > 0)
);

DROP TABLE IF EXISTS Cheltuiala_Factura_Intrare;
CREATE TABLE Cheltuiala_Factura_Intrare (
  id_factura      INT REFERENCES Factura_Intrare(id),
  nume_cheltuiala VARCHAR(255),

  tva  INT            NOT NULL DEFAULT 19,
  pret DECIMAL(10, 2) NOT NULL,

  PRIMARY KEY (id_factura, nume_cheltuiala),

  CHECK (tva >= 0 AND pret > 0)
);

DROP TABLE IF EXISTS Plata;
CREATE TABLE Plata (
  id INT AUTO_INCREMENT PRIMARY KEY,

  id_factura INT           NOT NULL REFERENCES Factura_Intrare(id),
  tip        VARCHAR(255)  NOT NULL REFERENCES Tip_Tranzactie(tip),

  data_ef DATE NOT NULL DEFAULT (CURRENT_DATE()),

  document_plata VARCHAR(255)   NOT NULL,
  detalii        VARCHAR(1023)  NOT NULL,
  valoare        DECIMAL(10, 2) NOT NULL,

  CHECK (valoare > 0)
);

DROP TABLE IF EXISTS Factura_Iesire;
CREATE TABLE Factura_Iesire (
  id INT AUTO_INCREMENT PRIMARY KEY,

  nume_client VARCHAR(255) NOT NULL REFERENCES Client(nume),

  reducere      INT  NOT NULL DEFAULT 0,
  data_emisa    DATE NOT NULL DEFAULT (CURRENT_DATE()),
  data_scadenta DATE NOT NULL DEFAULT (CURRENT_DATE()),

  CHECK (reducere >= 0)
);

DROP TABLE IF EXISTS Marfa_Iesire;
CREATE TABLE Marfa_Iesire (
  id_factura_iesire INT          REFERENCES Factura_Iesire(id),
  nume_produs       VARCHAR(255) REFERENCES Produs(nume),

  id_factura_intrare INT NOT NULL REFERENCES Factura_Intrare(id),

  tva      INT            NOT NULL DEFAULT 19,
  reducere INT            NOT NULL DEFAULT 0,
  buc      DECIMAL(10, 2) NOT NULL,
  pret     DECIMAL(10, 2) NOT NULL,

  PRIMARY KEY (id_factura, nume_produs),

  CHECK (tva >= 0 AND reducere >= 0 AND buc > 0 AND pret > 0)
);

DROP TABLE IF EXISTS Serviciu_Factura_Iesire;
CREATE TABLE Serviciu_Factura_Iesire (
  id_factura    INT REFERENCES Factura_Iesire(id),
  nume_serviciu VARCHAR(255),

  tva  INT            NOT NULL DEFAULT 19,
  pret DECIMAL(10, 2) NOT NULL,

  PRIMARY KEY (id_factura, nume_serviciu),

  CHECK (tva >= 0 AND pret > 0)
);

DROP TABLE IF EXISTS Incasare;
CREATE TABLE Incasare (
  id INT AUTO_INCREMENT PRIMARY KEY,

  id_factura INT          NOT NULL REFERENCES Factura_Intrare(id),
  tip        VARCHAR(255) NOT NULL REFERENCES Tip_Tranzactie(tip),

  data_ef DATE                                                NOT NULL DEFAULT (CURRENT_DATE()),
  status  ENUM('emisă', 'în procesare', 'eșuată', 'completă') NOT NULL DEFAULT ('emisă'),

  document_plata VARCHAR(255)   NOT NULL,
  detalii        VARCHAR(1023)  NOT NULL,
  valoare        DECIMAL(10, 2) NOT NULL,

  CHECK (valoare > 0)
);
