"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
//import { Collection, ObjectID } from "mongodb";
const mssql = require("mssql");
const odata_v4_mssql_1 = require("odata-v4-mssql");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connection_1 = require("./connection");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            const sqlQuery = odata_v4_mssql_1.createQuery(query);
            // console.log("\n\n\n================= sqlQuery:\n" + JSON.stringify(sqlQuery, null, 2));
            // console.log("\n\n===> " + `SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`);
            return yield new Promise((resolve, reject) => request.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}` /*, [...sqlQuery.parameters]*/, (err, results) => {
                return (err) ? reject(err) : resolve(results);
            }));
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            const sqlQuery = odata_v4_mssql_1.createQuery(query);
            console.log("\n\n===> " + `SELECT ${sqlQuery.select} FROM Products WHERE Id = ${key} AND (${sqlQuery.where})`);
            return yield new Promise((resolve, reject) => 
            //request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters], (err, result) =>
            request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ${key} AND (${sqlQuery.where})`, (err, result) => {
                console.log("\n\n\n================= result:\n" + JSON.stringify(result, null, 2));
                return (err) ? reject(err) : resolve(result[0]);
            }));
        });
    }
    getCategory(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            const sqlQuery = odata_v4_mssql_1.createQuery(query);
            return yield new Promise((resolve, reject) => 
            //request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) =>
            request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = '${result.CategoryId}' AND (${sqlQuery.where})`, (err, result) => {
                return (err) ? reject(err) : resolve(result[0]);
            }));
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            return yield new Promise((resolve, reject) => 
            //request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ? `, [key], (err, result) =>
            request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ${key}`, (err, result) => {
                //connection.close();
                return (err) ? reject(err) : resolve(result[0]);
            }));
        });
    }
    /*@odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            Id: new ObjectID(key)
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }*/
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const request1 = new mssql.Request(connection);
            yield new Promise((resolve, reject) => request1.query(`USE northwind_mssql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
            return yield new Promise((resolve, reject) => {
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                console.log(data);
                console.log([data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null]);
                const request2 = new mssql.Request(connection);
                //request2.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null], (err, result) =>
                request2.query(`INSERT INTO Products VALUES (${(data.QuantityPerUnit || null)}, ${(data.UnitPrice || null)}, ${(data.CategoryId || null)}, ${(data.Name || null)}, ${(data.Discontinued || null)}, ${(data.Id || null)});`, (err, result) => {
                    //connection.close();
                    return (err) ? reject(err) : resolve(result[0]);
                });
            });
        });
    }
    /*@odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data.Id = result.upsertedId
            return data;
        });
    }*/
    getDeltaObjectInSQL(delta) {
        const deltaKeys = Object.keys(delta);
        if (deltaKeys.length == 1)
            return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
        return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            /*let db = await mongodb();
            if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
            return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);*/
            console.log("++++++++++++++++++");
            console.log(delta);
            console.log(key);
            const connection = yield connection_1.default();
            const request = new mssql.Request(connection);
            return yield new Promise((resolve, reject) => 
            //request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key], (err, result) =>
            request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ${key}`, (err, result) => {
                //connection.close();
                return (err) ? reject(err) : resolve(result[0]);
            }));
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], ProductsController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.GET("Category"),
    __param(0, odata_v4_server_1.odata.result),
    __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "getCategory", null);
__decorate([
    odata_v4_server_1.odata.POST("Category").$ref,
    odata_v4_server_1.odata.PUT("Category").$ref,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.link)
], ProductsController.prototype, "setCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], ProductsController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body)
], ProductsController.prototype, "update", null);
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
};
CategoriesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=controller.js.map