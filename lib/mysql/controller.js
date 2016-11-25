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
const utils_1 = require("./utils");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            const results = yield connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
            return utils_1.mapDiscontinued(results);
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            const results = yield connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
            return utils_1.mapDiscontinued(utils_1.filterNullValues(results))[0];
        });
    }
    getCategory(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            return (yield connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters]))[0];
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ?`, [link, key]);
        });
    }
    unsetCategory(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [key]);
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const result = yield connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.Id || null, data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null]);
            return Object.assign({}, data, { Id: result.insertId });
        });
    }
    upsert(key, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`INSERT INTO Products (Id,QuantityPerUnit,UnitPrice,CategoryId,Name,Discontinued) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE QuantityPerUnit=?,UnitPrice=?,CategoryId=?,Name=?,Discontinued=?`, [key, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued]);
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(utils_1.getPatchQueryString('Products', delta), utils_1.getPatchQueryParameters(key, delta));
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`DELETE FROM Products WHERE Id = ?`, [key]);
        });
    }
    getCheapest() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const results = yield connection.query(`SELECT * FROM Products WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)`);
            return utils_1.mapDiscontinued(results)[0];
        });
    }
    getInPriceRange(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const results = yield connection.query(`SELECT * FROM Products WHERE UnitPrice BETWEEN ? AND ?`, [min, max]);
            return utils_1.mapDiscontinued(results);
        });
    }
    swapPrice(key1, key2) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const product1 = (yield connection.query(`SELECT * FROM Products WHERE Id = ?`, [key1]))[0];
            const product2 = (yield connection.query(`SELECT * FROM Products WHERE Id = ?`, [key2]))[0];
            yield connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product1.UnitPrice, key2]);
            yield connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product2.UnitPrice, key1]);
        });
    }
    discountProduct(productId, percent) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const product = yield connection.query(`SELECT * FROM Products WHERE Id = ?`, [productId]);
            const discountedPrice = ((100 - percent) / 100) * product[0].UnitPrice;
            yield connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [discountedPrice, productId]);
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
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body), __param(2, odata_v4_server_1.odata.context)
], ProductsController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], ProductsController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "remove", null);
__decorate([
    odata_v4_server_1.Edm.Function,
    odata_v4_server_1.Edm.EntityType(model_1.Product)
], ProductsController.prototype, "getCheapest", null);
__decorate([
    odata_v4_server_1.Edm.Function,
    odata_v4_server_1.Edm.Collection(odata_v4_server_1.Edm.EntityType(model_1.Product)),
    __param(0, odata_v4_server_1.Edm.Decimal), __param(1, odata_v4_server_1.Edm.Decimal)
], ProductsController.prototype, "getInPriceRange", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String), __param(1, odata_v4_server_1.Edm.String)
], ProductsController.prototype, "swapPrice", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String), __param(1, odata_v4_server_1.Edm.Int32)
], ProductsController.prototype, "discountProduct", null);
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            return yield connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            const results = yield connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
            return utils_1.filterNullValues(results)[0];
        });
    }
    getProducts(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            const results = yield connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE CategoryId = ? AND (${sqlQuery.where})`, [result.Id, ...sqlQuery.parameters]);
            return utils_1.mapDiscontinued(results);
        });
    }
    getProduct(key, result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const sqlQuery = odata_v4_mysql_1.createQuery(query);
            return (yield connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (CategoryId = ?,${sqlQuery.where})`, [key, result.Id, ...sqlQuery.parameters]))[0];
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return (yield connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ? `, [key, link]))[0];
        });
    }
    unsetCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return (yield connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [link]))[0];
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            const result = yield connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [data.Id || null, data.Description || null, data.Name || null]);
            const res = Object.assign({}, data, { Id: result.insertId });
            return res;
        });
    }
    upsert(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`INSERT INTO Categories (Id,Description,Name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Description=?,Name=?`, [key, data.Description, data.Name, data.Description, data.Name]);
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(utils_1.getPatchQueryString('Categories', delta), utils_1.getPatchQueryParameters(key, delta));
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = utils_1.promisifyWithDbName(yield connection_1.default());
            return yield connection.query(`DELETE FROM Categories WHERE Id = ?`, [key]);
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.GET("Products"),
    __param(0, odata_v4_server_1.odata.result), __param(1, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "getProducts", null);
__decorate([
    odata_v4_server_1.odata.GET("Products"),
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.result), __param(2, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "getProduct", null);
__decorate([
    odata_v4_server_1.odata.POST("Products").$ref,
    odata_v4_server_1.odata.PUT("Products").$ref,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.link)
], CategoriesController.prototype, "setCategory", null);
__decorate([
    odata_v4_server_1.odata.DELETE("Products").$ref,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.link)
], CategoriesController.prototype, "unsetCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], CategoriesController.prototype, "remove", null);
CategoriesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=controller.js.map