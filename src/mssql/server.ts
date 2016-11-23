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
        //await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("USE master", (err, result) => err ? reject(err) : resolve(result)));
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE master"))
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "DROP DATABASE IF EXISTS northwind_mssql_test_db", true))
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE DATABASE northwind_mssql_test_db", true))
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE northwind_mssql_test_db", true))
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE categories (Description NVARCHAR(25), Name NVARCHAR(14), id INT)", true))
        await new Promise<any>((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE products (QuantityPerUnit NVARCHAR(20), UnitPrice DECIMAL(5, 2), CategoryId INT, Name NVARCHAR(32), Discontinued BIT, id INT)", true))
        await Promise.all(categories.map(category =>
            new Promise<any>((resolve, reject) =>
                runQuery(mssql, connection, resolve, reject, `INSERT INTO categories VALUES ('${category.Description}','${category.Name}',${category.id});`, true)
            )));
        await Promise.all(products.map(product =>
            new Promise<any>((resolve, reject) =>
                runQuery(mssql, connection, resolve, reject, `INSERT INTO products VALUES ('${product.QuantityPerUnit}',${product.UnitPrice},${product.CategoryId},'${product.Name}',${(product.Discontinued ? 1 : 0)},${product.id});`, true)
            )));
    }
}

function runQuery(mssql: any, connection: any, resolve: Function, reject: Function, query: string, goOn: boolean = false) {
  return (new mssql.Request(connection)).query(query, (err, result) => {
    if (err) {
        console.log("ERR:", query, ":\n", err);
        return (goOn) ? resolve(err) : reject(err);
    }
    console.log("OK:", query);
    if (result) { console.log(result); }
    return resolve(result);
  });
}