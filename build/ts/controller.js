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
const mongodb_1 = require("mongodb");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connection_1 = require("./connection");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string")
                mongodbQuery.query.CategoryId = new mongodb_1.ObjectID(mongodbQuery.query.CategoryId);
            return db.collection("Products").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return db.collection("Products").findOne({ _id: new mongodb_1.ObjectID(key) }, {
                fields: mongodbQuery.projection
            });
        });
    }
    getCategory(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return db.collection("Categories").findOne({ _id: new mongodb_1.ObjectID(result.CategoryId) }, {
                fields: mongodbQuery.projection
            });
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                _id: new mongodb_1.ObjectID(key)
            }, {
                $set: { CategoryId: new mongodb_1.ObjectID(link) }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    unsetCategory(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                _id: new mongodb_1.ObjectID(key)
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
            if (data.CategoryId)
                data.CategoryId = new mongodb_1.ObjectID(data.CategoryId);
            return yield db.collection("Products").insertOne(data).then((result) => {
                data._id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            if (data.CategoryId)
                data.CategoryId = new mongodb_1.ObjectID(data.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new mongodb_1.ObjectID(key) }, data, {
                upsert: true
            }).then((result) => {
                data._id = result.upsertedId;
                return data;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            if (delta.CategoryId)
                delta.CategoryId = new mongodb_1.ObjectID(delta.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new mongodb_1.ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").deleteOne({ _id: new mongodb_1.ObjectID(key) }).then(result => result.deletedCount);
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
            const products = yield db.collection("Products").find({ _id: { $in: [new mongodb_1.ObjectID(a), new mongodb_1.ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
            const aProduct = products.find(product => product._id.toHexString() === a);
            const bProduct = products.find(product => product._id.toHexString() === b);
            yield db.collection("Products").update({ _id: new mongodb_1.ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
            yield db.collection("Products").update({ _id: new mongodb_1.ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
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
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            return db.collection("Categories").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return db.collection("Categories").findOne({ _id: new mongodb_1.ObjectID(key) }, {
                fields: mongodbQuery.projection
            });
        });
    }
    getProducts(result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string")
                mongodbQuery.query.CategoryId = new mongodb_1.ObjectID(mongodbQuery.query.CategoryId);
            return db.collection("Products").find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] }, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        });
    }
    getProduct(key, result, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string")
                mongodbQuery.query.CategoryId = new mongodb_1.ObjectID(mongodbQuery.query.CategoryId);
            return db.collection("Products").findOne({
                $and: [{ _id: new mongodb_1.ObjectID(key), CategoryId: result._id }, mongodbQuery.query]
            }, {
                fields: mongodbQuery.projection
            });
        });
    }
    setCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                _id: new mongodb_1.ObjectID(link)
            }, {
                $set: { CategoryId: new mongodb_1.ObjectID(key) }
            }).then((result) => {
                return result.modifiedCount;
            });
        });
    }
    unsetCategory(key, link) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Products").updateOne({
                _id: new mongodb_1.ObjectID(link)
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
                data._id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Categories").updateOne({ _id: new mongodb_1.ObjectID(key) }, data, {
                upsert: true
            }).then((result) => {
                data._id = result.upsertedId;
                return data;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            if (delta.CategoryId)
                delta.CategoryId = new mongodb_1.ObjectID(delta.CategoryId);
            return yield db.collection("Categories").updateOne({ _id: new mongodb_1.ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield connection_1.default();
            return yield db.collection("Categories").deleteOne({ _id: new mongodb_1.ObjectID(key) }).then(result => result.deletedCount);
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
//# sourceMappingURL=controller.js.map