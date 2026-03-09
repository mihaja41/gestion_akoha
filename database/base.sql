create database if not exists gestion_akoho;
GO

USE gestion_akoho;
GO

CREATE TABLE race(
   Id_race INT IDENTITY,
   nom VARCHAR(50) ,
   prix_sakafo FLOAT,
   prix_vente FLOAT,
   prix_vente_atody FLOAT,
   PRIMARY KEY(Id_race)
);
GO

CREATE TABLE description_race(
   Id_description_race INT IDENTITY,
   age VARCHAR(50) ,
   variation_poids FLOAT,
   lanja_sakafo VARCHAR(50) ,
   Id_race INT NOT NULL,
   PRIMARY KEY(Id_description_race),
   FOREIGN KEY(Id_race) REFERENCES race(Id_race)
);
GO

CREATE TABLE lot_akoho(
   Id_lot_akoho INT IDENTITY,
   numero INT,
   date_entree DATE,
   nombre INT,
   age INT,
   prix_achat FLOAT,
   Id_race INT NOT NULL,
   PRIMARY KEY(Id_lot_akoho),
   FOREIGN KEY(Id_race) REFERENCES race(Id_race)
);
GO

CREATE TABLE lot_atody(
   Id_lot_atody INT IDENTITY,
   numero INT,
   date_entree DATE,
   nombre INT,
   Id_lot_akoho INT NOT NULL,
   PRIMARY KEY(Id_lot_atody),
   FOREIGN KEY(Id_lot_akoho) REFERENCES lot_akoho(Id_lot_akoho)
);
GO

CREATE TABLE naissance_oeuf(
   Id_naissance_oeuf INT IDENTITY,
   nombre_poussin VARCHAR(50) ,
   date_naissance DATE,
   Id_lot_atody INT NOT NULL,
   PRIMARY KEY(Id_naissance_oeuf),
   FOREIGN KEY(Id_lot_atody) REFERENCES lot_atody(Id_lot_atody)
);
GO

CREATE TABLE akoho_maty(
   Id_akoho_maty INT IDENTITY,
   date_mort DATE,
   nombre INT,
   Id_lot_akoho INT NOT NULL,
   PRIMARY KEY(Id_akoho_maty),
   FOREIGN KEY(Id_lot_akoho) REFERENCES lot_akoho(Id_lot_akoho)
);
GO
