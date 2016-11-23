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
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const odata_v4_mysql_1 = require("odata-v4-mysql");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connection_1 = require("./connection");
function getDeltaObjectInSQL(delta) {
    const deltaKeys = Object.keys(delta);
    if (deltaKeys.length == 1)
        return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
    return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}
function mapDiscontinued(results) {
    return results.map(result => {
        result.Discontinued = (result.Discontinued == 1) ? true : false;
        return result;
    });
}
function promisifyWithDdName(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];
            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(`USE northwind_mysql_test_db`, (error, res) => {
                        if (error)
                            return reject(error);
                        target.query(...args, (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    });
                });
            };
        }
    });
}
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            return yield new Promise((resolve, reject) => connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}` /*, [...sqlQuery.parameters]*/, (err, result) => (err) ? reject(err) : resolve(result[0])));
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = promisifyWithDdName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            const results = yield connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
            return mapDiscontinued(results)[0];
        });
    }
    getCategory(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            return yield new Promise((resolve, reject) => connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) => (err) ? reject(err) : resolve(result[0])));
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            return yield new Promise((resolve, reject) => connection.query(`UPDATE Categories SET CategoryId = ${link} WHERE id = ? `, [key], (err, result) => (err) ? reject(err) : resolve(result[0])));
        });
    }
    unsetCategory(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            return yield new Promise((resolve, reject) => connection.query(`UPDATE Products SET CategoryId = NULL WHERE id = ?`, [key], (err, result) => (err) ? reject(err) : resolve(result[0])));
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            yield new Promise((resolve, reject) => connection.query(`USE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
            return yield new Promise((resolve, reject) => {
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                console.log(data);
                console.log([data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.id || null]);
                connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.id || null], (err, result) => (err) ? reject(err) : resolve(result[0]));
            });
        });
    }
    /*@odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").updateOne({ id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data.id = result.upsertedId
            return data;
        });
    }*/
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("++++++++++++++++++");
            console.log(delta);
            console.log(key);
            const connection = yield connection_1.default();
            return yield new Promise((resolve, reject) => {
                connection.query(`USE northwind_mysql_test_db`, (error, res) => {
                    connection.query(`UPDATE Products SET ${getDeltaObjectInSQL(delta)} WHERE id = ? `, [key], (err, result) => (err) ? reject(err) : resolve(result[0]));
                });
            });
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = promisifyWithDdName(yield connection_1.default());
            return yield connection.query(`DELETE FROM Products WHERE id = ?`, [key]);
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], ProductsController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.GET("Category"),
    __param(0, odata_v4_server_1.odata.result), __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "getCategory", null);
__decorate([
    odata_v4_server_1.odata.POST("Category").$ref,
    odata_v4_server_1.odata.PUT("Category").$ref,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.link)
], ProductsController.prototype, "setCategory", null);
__decorate([
    odata_v4_server_1.odata.DELETE("Category").$ref,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "unsetCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], ProductsController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], ProductsController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "remove", null);
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