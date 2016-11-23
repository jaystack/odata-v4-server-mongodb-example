import * as mssql from "mssql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mssqlConnection from "./connection";
import { Category, Product } from "./model";
const categories: Category[] = require("../../src/mssql/categories");
const products: Product[] = require("../../src/mssql/products");

@odata.namespace("Northwinds")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {

    @Edm.ActionImport
    async initDb() {
        const connection = await mssqlConnection();
        console.log("=== AFTER connection");
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("USE master", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("DROP DATABASE IF EXISTS northwind_mssql_test_db", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("CREATE DATABASE northwind_mssql_test_db", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("USE northwind_mssql_test_db", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("CREATE TABLE categories (Description NVARCHAR(25), Name NVARCHAR(14), id INT);", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("CREATE TABLE products (QuantityPerUnit NVARCHAR(20), UnitPrice DECIMAL(5, 2), CategoryId INT, Name NVARCHAR(32), Discontinued BIT, id INT);", (err, result) => err ? reject(err) : resolve(result)));
        await Promise.all(categories.map(category =>
            new Promise<any>((resolve, reject) =>
                (new mssql.Request(connection)).query(`INSERT INTO categories VALUES ('${category.Description}','${category.Name}',${category.id});`, (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
        await Promise.all(products.map(product =>
            new Promise<any>((resolve, reject) =>
                (new mssql.Request(connection)).query(`INSERT INTO products VALUES ('${product.QuantityPerUnit}',${product.UnitPrice},${product.CategoryId},'${product.Name}',${product.Discontinued},${product.id});`, (err, result) =>
                    (err) ? reject(err) : resolve(result))
            )));
        console.log("DB init done");
    }
}