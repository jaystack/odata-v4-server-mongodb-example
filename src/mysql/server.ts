import * as mysql from "mysql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mysqlConnection from "./connection";
import { Category, Product } from "./model";
const categories: Category[] = require("../../src/mysql/categories");
const products: Product[] = require("../../src/mysql/products");

@odata.namespace("Northwinds")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {

    /*async executeQuery() {
        return await new Promise<any>((resolve, reject) => connection.query(`DROP DATABASE IF EXISTS northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
    }*/

    @Edm.ActionImport
    async initDb() {
        const connection = await mysqlConnection();
        await new Promise<any>((resolve, reject) => connection.query(`DROP DATABASE IF EXISTS northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query(`CREATE DATABASE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query(`USE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query("CREATE TABLE categories (`Description` VARCHAR(25) CHARACTER SET utf8,`Name` VARCHAR(14) CHARACTER SET utf8,`id` INT);", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => connection.query("CREATE TABLE products (`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` VARCHAR(5) CHARACTER SET utf8,`id` INT);", (err, result) => err ? reject(err) : resolve(result)));
        await Promise.all(categories.map(category =>
            new Promise<any>((resolve, reject) =>
                connection.query(`INSERT INTO categories VALUES (?,?,?);`, [category.Description, category.Name, category.id], (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
        await Promise.all(products.map(product =>
            new Promise<any>((resolve, reject) =>
                connection.query(`INSERT INTO products VALUES (?,?,?,?,?,?);`, [product.QuantityPerUnit, product.UnitPrice, product.CategoryId, product.Name, product.Discontinued, product.id], (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
    }
}