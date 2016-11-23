"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mssql = require("mssql");
const odata_v4_server_1 = require("odata-v4-server");
const controller_1 = require("./controller");
const connection_1 = require("./connection");
const categories = require("../../src/mssql/categories");
const products = require("../../src/mssql/products");
let NorthwindServer = class NorthwindServer extends odata_v4_server_1.ODataServer {
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            //await new Promise<any>((resolve, reject) => (new mssql.Request(connection)).query("USE master", (err, result) => err ? reject(err) : resolve(result)));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE master"));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "DROP DATABASE IF EXISTS northwind_mssql_test_db", true));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE DATABASE northwind_mssql_test_db", true));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "USE northwind_mssql_test_db", true));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE categories (Description NVARCHAR(25), Name NVARCHAR(14), id INT)", true));
            yield new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, "CREATE TABLE products (QuantityPerUnit NVARCHAR(20), UnitPrice DECIMAL(5, 2), CategoryId INT, Name NVARCHAR(32), Discontinued BIT, id INT)", true));
            yield Promise.all(categories.map(category => new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, `INSERT INTO categories VALUES ('${category.Description}','${category.Name}',${category.id});`, true))));
            yield Promise.all(products.map(product => new Promise((resolve, reject) => runQuery(mssql, connection, resolve, reject, `INSERT INTO products VALUES ('${product.QuantityPerUnit}',${product.UnitPrice},${product.CategoryId},'${product.Name}',${(product.Discontinued ? 1 : 0)},${product.id});`, true))));
        });
    }
};
__decorate([
    odata_v4_server_1.Edm.ActionImport
], NorthwindServer.prototype, "initDb", null);
NorthwindServer = __decorate([
    odata_v4_server_1.odata.namespace("Northwinds"),
    odata_v4_server_1.odata.controller(controller_1.ProductsController, true),
    odata_v4_server_1.odata.controller(controller_1.CategoriesController, true)
], NorthwindServer);
exports.NorthwindServer = NorthwindServer;
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
//# sourceMappingURL=server.js.map