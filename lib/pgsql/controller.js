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
const odata_v4_server_1 = require("odata-v4-server");
const odata_v4_pg_1 = require("odata-v4-pg");
const model_1 = require("./model");
const connect_1 = require("./connect");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    select(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const sqlQuery = odata_v4_pg_1.createQuery(query);
            const result = yield db.query(sqlQuery.from('"Products"'), sqlQuery.parameters);
            return result.rows;
        });
    }
    selectOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const sqlQuery = odata_v4_pg_1.createQuery(query);
            const result = yield db.query(`SELECT ${sqlQuery.select} FROM "Products"
                                        WHERE "Id" = $${sqlQuery.parameters.length + 1} AND (${sqlQuery.where})`, [...sqlQuery.parameters, key]);
            return result.rows[0];
        });
    }
    getCategory(product, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const sqlQuery = odata_v4_pg_1.createQuery(query);
            const result = yield db.query(sqlQuery.from('"Categories"'), sqlQuery.parameters);
            return result.rows[0];
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], ProductsController.prototype, "select", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "selectOne", null);
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
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=controller.js.map