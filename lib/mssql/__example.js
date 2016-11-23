"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var sql = require('mssql');
var mssql = sql;
const categories = require("../../src/mssql/categories");
const products = require("../../src/mssql/products");
var dbConfig = {
    server: "localhost\\MSSQLSERVER",
    database: "",
    user: "sa",
    password: "QWEasd123%",
    port: 1433,
    options: {
        encrypt: true
    },
    requestTimeout: 1000
};
var conn = new sql.Connection(dbConfig);
console.log("HALIHÓ 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
conn.connect().then(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("HALIHÓ 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        var req = new sql.Request(conn);
        req.query("SELECT * FROM mytest.dbo.t1").then(function (recordset) {
            console.log(recordset);
            //conn.close();
        })
            .catch(function (err) {
            console.log(err);
            //conn.close();
        });
        // /////////////////////////////
        var connection = conn;
        yield new Promise((resolve, reject) => (new mssql.Request(connection)).query("USE mytest", (err, result) => err ? reject(err) : resolve(result)));
        const recordset = yield new Promise((resolve, reject) => (new mssql.Request(connection)).query("SELECT * FROM mytest.dbo.t1", (err, result) => err ? reject(err) : resolve(result)));
        console.log(recordset);
        let myResults = yield new Promise((resolve, reject) => (new mssql.Request(connection)).query("Select 42 as number", (err, result) => err ? reject(err) : resolve(result)));
        console.log("\n\n\n==================== myresults:", myResults, "\n\n");
        //await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("USE master", (err, result) => err ? (console.log(err), reject(err)) : resolve(result)));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE master"));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "DROP DATABASE IF EXISTS northwind_mssql_test_db", true));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE DATABASE northwind_mssql_test_db", true));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE northwind_mssql_test_db", true));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE categories (Description NVARCHAR(25), Name NVARCHAR(14), id INT)", true));
        yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE products (QuantityPerUnit NVARCHAR(20), UnitPrice DECIMAL(5, 2), CategoryId INT, Name NVARCHAR(32), Discontinued BIT, id INT)", true));
        yield Promise.all(categories.map(category => new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, `INSERT INTO categories VALUES ('${category.Description}','${category.Name}',${category.id});`, true))));
        yield Promise.all(products.map(product => new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, `INSERT INTO products VALUES ('${product.QuantityPerUnit}',${product.UnitPrice},${product.CategoryId},'${product.Name}',${(product.Discontinued ? 1 : 0)},${product.id});`, true))));
    });
})
    .catch(function (err) {
    console.log(err);
});
function runQuery(mssql, connection, resolve, reject, query, goOn = false) {
    return (new mssql.Request(connection)).query(query, (err, result) => {
        if (err) {
            console.log("ERR:", query, ":\n", err);
            return (goOn) ? resolve(err) : reject(err);
        }
        console.log("OK:", query);
        if (result) {
            console.log(result);
        }
        return resolve(result);
    });
}
//runSqlFile("c:\_CODE\odata-v4-server\odata-v4-server-mongodb-example\src\mssql\sql.sql", "MsSql");
//# sourceMappingURL=__example.js.map