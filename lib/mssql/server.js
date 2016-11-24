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
const fs = require('fs');
const mssql = require("mssql");
const odata_v4_server_1 = require("odata-v4-server");
const controller_1 = require("./controller");
const connection_1 = require("./connection");
let NorthwindServer = class NorthwindServer extends odata_v4_server_1.ODataServer {
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            const sqlCommands = fs.readFileSync("./src/mssql/mssql.sql", "utf-8");
            yield request.query(sqlCommands);
        });
    }
    testProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            const sqlCommand = "Select * From dbo.Products Where Id = 57";
            yield new Promise((resolve, reject) => {
                request.query(sqlCommand, (err, result) => {
                    if (err) {
                        console.log("testProduct - err:", err);
                        return reject(err);
                    }
                    console.log("testProduct - result.slice(0, 2):", JSON.stringify(result.slice(0, 2), null, 2));
                    console.log("testProduct - result.slice(-2) :", JSON.stringify(result.slice(-2), null, 2));
                    console.log("testProduct - result.length:", result.length);
                    console.log(sqlCommand);
                    return resolve(result);
                });
            });
        });
    }
};
__decorate([
    odata_v4_server_1.Edm.ActionImport
], NorthwindServer.prototype, "initDb", null);
__decorate([
    odata_v4_server_1.Edm.ActionImport
], NorthwindServer.prototype, "testProduct", null);
NorthwindServer = __decorate([
    odata_v4_server_1.odata.namespace("Northwind"),
    odata_v4_server_1.odata.controller(controller_1.ProductsController, true),
    odata_v4_server_1.odata.controller(controller_1.CategoriesController, true)
], NorthwindServer);
exports.NorthwindServer = NorthwindServer;
//# sourceMappingURL=server.js.map