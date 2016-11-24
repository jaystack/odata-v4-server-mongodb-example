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
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const odata_v4_server_1 = require("odata-v4-server");
const controller_1 = require("./controller");
const connection_1 = require("./connection");
const categories = require("../../src/mysql/categories");
const products = require("../../src/mysql/products");
let NorthwindServer = class NorthwindServer extends odata_v4_server_1.ODataServer {
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            yield new Promise((resolve, reject) => connection.query(`DROP DATABASE IF EXISTS northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
            yield new Promise((resolve, reject) => connection.query(`CREATE DATABASE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
            yield new Promise((resolve, reject) => connection.query(`USE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
            yield new Promise((resolve, reject) => connection.query("CREATE TABLE Categories (`Id` INT AUTO_INCREMENT,`Description` VARCHAR(25) CHARACTER SET utf8,`Name` VARCHAR(32) CHARACTER SET utf8, PRIMARY KEY (Id));", (err, result) => err ? reject(err) : resolve(result)));
            yield new Promise((resolve, reject) => connection.query("CREATE TABLE Products (`Id` INT AUTO_INCREMENT,`QuantityPerUnit` VARCHAR(20) CHARACTER SET utf8,`UnitPrice` NUMERIC(5, 2),`CategoryId` INT,`Name` VARCHAR(32) CHARACTER SET utf8,`Discontinued` TINYINT(1), PRIMARY KEY (Id), FOREIGN KEY (CategoryId) REFERENCES Categories(Id));", (err, result) => err ? reject(err) : resolve(result)));
            yield Promise.all(categories.map(category => new Promise((resolve, reject) => connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [category.Id, category.Description, category.Name], (err, result) => (err) ? reject(err) : resolve(result)))));
            yield Promise.all(products.map(product => new Promise((resolve, reject) => connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [product.Id, product.QuantityPerUnit, product.UnitPrice, product.CategoryId, product.Name, product.Discontinued], (err, result) => (err) ? reject(err) : resolve(result)))));
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
//# sourceMappingURL=server.js.map