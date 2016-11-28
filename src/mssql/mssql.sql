USE master;
--DROP DATABASE IF EXISTS northwind_mssql_test_db;
--CREATE DATABASE northwind_mssql_test_db;
USE northwind_mssql_test_db;

DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Categories;
CREATE TABLE Categories (
	Description NVARCHAR(100),
	Name NVARCHAR(50),
	Id INT IDENTITY(1,1) CONSTRAINT pk_Categories PRIMARY KEY
)  ON [PRIMARY];
CREATE TABLE Products (
	QuantityPerUnit NVARCHAR(50),
	UnitPrice DECIMAL(5, 2),
	CategoryId INT,
	Name NVARCHAR(50),
	Discontinued BIT,
	Id INT IDENTITY(1,1) CONSTRAINT pk_Products PRIMARY KEY
--, CONSTRAINT fk_ProductCategory FOREIGN KEY (CategoryId) references Categories (Id)
)  ON [PRIMARY];

SET IDENTITY_INSERT Categories ON; -- Column names must be specified in insert statements
INSERT INTO Categories (Description, Name, Id) VALUES ('Soft drinks','Beverages',1);
INSERT INTO Categories (Description, Name, Id) VALUES ('Breads','Grains/Cereals',2);
INSERT INTO Categories (Description, Name, Id) VALUES ('Prepared meats','Meat/Poultry',3);
INSERT INTO Categories (Description, Name, Id) VALUES ('Dried fruit and bean curd','Produce',4);
INSERT INTO Categories (Description, Name, Id) VALUES ('Seaweed and fish','Seafood',5);
INSERT INTO Categories (Description, Name, Id) VALUES ('Sweet and savory sauces','Condiments',6);
INSERT INTO Categories (Description, Name, Id) VALUES ('Cheeses','Dairy Products',7);
INSERT INTO Categories (Description, Name, Id) VALUES ('Desserts','Confections',8);
SET IDENTITY_INSERT Categories OFF;

SET IDENTITY_INSERT Products ON; -- Column names must be specified in insert statements
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 boxes x 20 bags',39,1,'Chai',0,1);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 12 oz bottles',19,1,'Chang',1,2);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 550 ml bottles',10,6,'Aniseed Syrup',0,3);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('48 - 6 oz jars',22,6,'Chef Anton`s Cajun Seasoning',1,4);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('36 boxes',21.35,6,'Chef Anton`s Gumbo Mix',0,5);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 8 oz jars',25,6,'Grandma`s Boysenberry Spread',0,6);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 200 ml jars',31,5,'Ikura',0,7);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('1 kg pkg.',21,7,'Queso Cabrales',0,8);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 - 500 g pkgs.',38,7,'Queso Manchego La Pastora',1,9);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('2 kg box',6,5,'Konbu',0,10);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('40 - 100 g pkgs.',23.25,4,'Tofu',0,11);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 250 ml bottles',15.5,6,'Genen Shouyu',0,12);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('32 - 500 g boxes',17.45,8,'Pavlova',0,13);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('20 - 1 kg tins',39,3,'Alice Mutton',0,14);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('16 kg pkg.',62.5,5,'Carnarvon Tigers',0,15);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 boxes x 12 pieces',9.2,8,'Teatime Chocolate Biscuits',1,16);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('30 gift boxes',81,8,'Sir Rodney`s Marmalade',0,17);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 pkgs. x 4 pieces',10,8,'Sir Rodney`s Scones',0,18);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 1 lb pkgs.',30,4,'Uncle Bob`s Organic Dried Pears',1,19);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 12 oz jars',40,6,'Northwoods Cranberry Sauce',0,20);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('18 - 500 g pkgs.',97,3,'Mishi Kobe Niku',0,21);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 500 g pkgs.',21,2,'Gustaf`s Knäckebröd',0,22);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 250 g pkgs.',9,2,'Tunnbröd',0,23);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 355 ml cans',4.5,1,'Guaraná Fantástica',0,24);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('20 - 450 g glasses',14,8,'NuNuCa Nuß-Nougat-Creme',1,25);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('100 - 250 g bags',31.23,8,'Gumbär Gummibärchen',0,26);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 - 200 g glasses',25.89,5,'Nord-Ost Matjeshering',1,27);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 100 g pkgs',12.5,7,'Gorgonzola Telino',0,28);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 200 g pkgs.',32,7,'Mascarpone Fabioli',0,29);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('500 g',2.5,7,'Geitost',0,30);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 12 oz bottles',14,1,'Sasquatch Ale',0,31);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 12 oz bottles',18,1,'Steeleye Stout',0,32);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 250 g  jars',19,5,'Inlagd Sill',0,33);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 500 g pkgs.',26,5,'Gravad lax',0,34);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 75 cl bottles',263.5,1,'Côte de Blaye',0,35);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('750 cc per bottle',18,1,'Chartreuse verte',0,36);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 4 oz tins',18.4,5,'Boston Crab Meat',0,37);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 12 oz cans',9.65,5,'Jack`s New England Clam Chowder',1,38);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('32 - 1 kg pkgs.',14,2,'Singaporean Hokkien Fried Mee',1,39);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('16 - 500 g tins',46,1,'Ipoh Coffee',0,40);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('1k pkg.',9.5,5,'Rogede sild',0,41);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('4 - 450 g glasses',12,5,'Spegesild',0,42);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 - 4 oz boxes',9.5,8,'Zaanse koeken',0,43);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('100 - 100 g pieces',43.9,8,'Schoggi Schokolade',0,44);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('25 - 825 g cans',45.6,4,'Rössle Sauerkraut',0,45);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('50 bags x 30 sausgs.',123.79,3,'Thüringer Rostbratwurst',1,46);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 pkgs.',12.75,8,'Chocolade',0,47);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 50 g pkgs.',20,8,'Maxilaku',0,48);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 - 100 g bars',16.25,8,'Valkoinen suklaa',1,49);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('50 - 300 g pkgs.',53,4,'Manjimup Dried Apples',1,50);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('16 - 2 kg boxes',7,2,'Filo Mix',0,51);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 250 g pkgs.',38,2,'Gnocchi di nonna Alice',1,52);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 250 g pkgs.',19.5,2,'Ravioli Angelo',0,53);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 pieces',13.25,5,'Escargots de Bourgogne',0,54);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('5 kg pkg.',55,7,'Raclette Courdavault',0,55);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('15 - 300 g rounds',34,7,'Camembert Pierrot',1,56);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 500 ml bottles',28.5,6,'Sirop d`érable',1,57);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('48 pies',49.3,8,'Tarte au sucre',0,58);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('15 - 625 g jars',43.9,6,'Vegie-spread',0,59);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('20 bags x 4 pieces',33.25,2,'Wimmers gute Semmelknödel',1,60);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('32 - 8 oz bottles',21.05,6,'Louisiana Fiery Hot Pepper Sauce',1,61);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 8 oz jars',17,6,'Louisiana Hot Spiced Okra',0,62);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 12 oz bottles',14,1,'Laughing Lumberjack Lager',1,63);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 boxes x 8 pieces',12.5,8,'Scottish Longbreads',0,64);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('Crate',666,7,'MyProduct',1,65);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 355 ml bottles',15,1,'Outback Lager',0,66);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('10 - 500 g pkgs.',21.5,7,'Flotemysost',0,67);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 200 g pkgs.',34.8,7,'Mozzarella di Giovanni',0,68);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 150 g jars',15,5,'Röd Kaviar',0,69);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('48 pieces',32.8,3,'Perth Pasties',1,70);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('16 pies',7.45,3,N'Tourtière',1,71);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 boxes x 2 pies',24,3,'Pâté chinois',1,72);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('5 kg pkg.',10,4,'Longlife Tofu',0,73);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('24 - 0.5 l bottles',7.75,1,'Rhönbräu Klosterbier',1,74);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('500 ml',18,1,'Lakkalikööri',0,75);
INSERT INTO Products (QuantityPerUnit, UnitPrice, CategoryId, Name, Discontinued, Id) VALUES ('12 boxes',13,6,'Original Frankfurter grüne Soße',0,76);
SET IDENTITY_INSERT Products OFF;