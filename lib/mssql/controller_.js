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
const odata_v4_mssql_1 = require("odata-v4-mssql");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connection_1 = require("./connection");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            // if (typeof mssqlQuery.query._id == "string") mssqlQuery.query._id = new ObjectID(mssqlQuery.query._id);
            // if (typeof mssqlQuery.query.CategoryId == "string") mssqlQuery.query.CategoryId = new ObjectID(mssqlQuery.query.CategoryId);
            return db.collection("Products").find(mssqlQuery.query, mssqlQuery.projection, mssqlQuery.skip, mssqlQuery.limit).toArray();
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            return db.collection("Products").findOne({ id: key }, {
                fields: mssqlQuery.projection
            });
        });
    }
    getCategory(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            return db.collection("Categories").findOne({ id: result.CategoryId }, {
                fields: mssqlQuery.projection
            });
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                id: key
            }, {
                $set: { CategoryId: link }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    unsetCategory(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                id: key
            }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            //if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
            return yield db.collection("Products").insertOne(data).then((result) => {
                data.id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            //if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
            return yield db.collection("Products").updateOne({ id: key }, data, {
                upsert: true
            }).then((result) => {
                data.id = result.upsertedId;
                return data;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            //if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
            return yield db.collection("Products").updateOne({ id: key }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").deleteOne({ id: key }).then(result => result.deletedCount);
        });
    }
    getCheapest() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return (yield db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
        });
    }
    getInPriceRange(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
        });
    }
    swapPrice(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            const products = yield db.collection("Products").find({ id: { $in: [a, b] } }, { UnitPrice: 1 }).toArray();
            const aProduct = products.find(product => product.id === a);
            const bProduct = products.find(product => product.id === b);
            yield db.collection("Products").update({ id: a }, { $set: { UnitPrice: bProduct.UnitPrice } });
            yield db.collection("Products").update({ id: b }, { $set: { UnitPrice: aProduct.UnitPrice } });
        });
    }
    discountProduct(productId, percent) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            const product = yield db.collection("Products").findOne({ id: productId });
            const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
            yield db.collection("Products").update({ id: productId }, { $set: { UnitPrice: discountedPrice } });
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
    odata_v4_server_1.odata.DELETE("Category").$ref,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "unsetCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], ProductsController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body),
    __param(2, odata_v4_server_1.odata.context)
], ProductsController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body)
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
    __param(0, odata_v4_server_1.Edm.Decimal),
    __param(1, odata_v4_server_1.Edm.Decimal)
], ProductsController.prototype, "getInPriceRange", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String),
    __param(1, odata_v4_server_1.Edm.String)
], ProductsController.prototype, "swapPrice", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String),
    __param(1, odata_v4_server_1.Edm.Int32)
], ProductsController.prototype, "discountProduct", null);
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            //if (typeof mssqlQuery.query._id == "string") mssqlQuery.query._id = new ObjectID(mssqlQuery.query._id);
            return db.collection("Categories").find(mssqlQuery.query, mssqlQuery.projection, mssqlQuery.skip, mssqlQuery.limit).toArray();
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            return db.collection("Categories").findOne({ id: key }, {
                fields: mssqlQuery.projection
            });
        });
    }
    getProducts(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            // if (typeof mssqlQuery.query._id == "string") mssqlQuery.query._id = new ObjectID(mssqlQuery.query._id);
            // if (typeof mssqlQuery.query.CategoryId == "string") mssqlQuery.query.CategoryId = new ObjectID(mssqlQuery.query.CategoryId);
            return db.collection("Products").find({ $and: [{ CategoryId: result.id }, mssqlQuery.query] }, mssqlQuery.projection, mssqlQuery.skip, mssqlQuery.limit).toArray();
        });
    }
    getProduct(key, result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mssqlQuery = odata_v4_mssql_1.createQuery(query);
            // if (typeof mssqlQuery.query._id == "string") mssqlQuery.query._id = new ObjectID(mssqlQuery.query._id);
            // if (typeof mssqlQuery.query.CategoryId == "string") mssqlQuery.query.CategoryId = new ObjectID(mssqlQuery.query.CategoryId);
            return db.collection("Products").findOne({
                $and: [{ id: key, CategoryId: result.id }, mssqlQuery.query]
            }, {
                fields: mssqlQuery.projection
            });
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                id: link
            }, {
                $set: { CategoryId: key }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    unsetCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                id: link
            }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Categories").insertOne(data).then((result) => {
                data.id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Categories").updateOne({ id: key }, data, {
                upsert: true
            }).then((result) => {
                data.id = result.upsertedId;
                return data;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            //if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
            return yield db.collection("Categories").updateOne({ id: key }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Categories").deleteOne({ id: key }).then(result => result.deletedCount);
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.GET("Products"),
    __param(0, odata_v4_server_1.odata.result),
    __param(1, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "getProducts", null);
__decorate([
    odata_v4_server_1.odata.GET("Products"),
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.result),
    __param(2, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "getProduct", null);
__decorate([
    odata_v4_server_1.odata.POST("Products").$ref,
    odata_v4_server_1.odata.PUT("Products").$ref,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.link)
], CategoriesController.prototype, "setCategory", null);
__decorate([
    odata_v4_server_1.odata.DELETE("Products").$ref,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.link)
], CategoriesController.prototype, "unsetCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body)
], CategoriesController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], CategoriesController.prototype, "remove", null);
CategoriesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=controller_.js.map