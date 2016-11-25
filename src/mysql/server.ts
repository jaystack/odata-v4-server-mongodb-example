import * as mysql from "mysql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mysqlConnection from "./connection";
import { Category, Product } from "./model";
const categories: Category[] = require("../../src/mysql/categories");
const products: Product[] = require("../../src/mysql/products");

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {

    @Edm.ActionImport
    async initDb() {
        const connection = await mysqlConnection();
        await new Promise<any>((resolve, reject) => connection.query(`DROP DATABASE IF EXISTS northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query(`CREATE DATABASE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query(`USE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query("CREATE TABLE Categories (`Id` INT AUTO_INCREMENT,`Description` VARCHAR(25) CHARACTER SET utf8,`Name` VARCHAR(32) CHARACTER SET utf8, PRIMARY KEY (Id));", (err, result) => err ? reject(err) : resolve(result)));
        //await new Promise<any>((resolve, reject) => connection.query("CREATE TABLE Products (`Id` INT AUTO_INCREMENT,`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` TINYINT(1), PRIMARY KEY (Id), FOREIGN KEY (CategoryId) REFERENCES Categories(Id));", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query("CREATE TABLE Products (`Id` INT AUTO_INCREMENT,`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` TINYINT(1), PRIMARY KEY (Id));", (err, result) => err ? reject(err) : resolve(result)));
        await Promise.all(categories.map(category =>
            new Promise<any>((resolve, reject) =>
                connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [category.Id, category.Description, category.Name], (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
        await Promise.all(products.map(product =>
            new Promise<any>((resolve, reject) =>
                connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [product.Id, product.QuantityPerUnit, product.UnitPrice, product.CategoryId, product.Name, product.Discontinued], (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
    }
}