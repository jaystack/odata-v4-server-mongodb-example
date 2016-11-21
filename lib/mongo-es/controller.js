"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CategoriesController = exports.ProductsController = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _desc, _value, _class2, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _class3, _desc2, _value2, _class4;

var _mongodb = require("mongodb");

var _odataV4Mongodb = require("odata-v4-mongodb");

var _odataV4Server = require("odata-v4-server");

var _model = require("./model");

var _connection = require("./connection");

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

let ProductsController = exports.ProductsController = (_dec = _odataV4Server.odata.type(_model.Product), _dec2 = _odataV4Server.odata.GET, _dec3 = _odataV4Server.odata.GET, _dec4 = _odataV4Server.odata.GET("Category"), _dec5 = _odataV4Server.odata.POST("Category").$ref, _dec6 = _odataV4Server.odata.PUT("Category").$ref, _dec7 = _odataV4Server.odata.DELETE("Category").$ref, _dec8 = _odataV4Server.odata.POST, _dec9 = _odataV4Server.odata.PUT, _dec10 = _odataV4Server.odata.PATCH, _dec11 = _odataV4Server.odata.DELETE, _dec12 = _odataV4Server.Edm.Function, _dec13 = _odataV4Server.Edm.EntityType(_model.Product), _dec14 = _odataV4Server.Edm.Function, _dec15 = _odataV4Server.Edm.Collection(_odataV4Server.Edm.EntityType(_model.Product)), _dec16 = _odataV4Server.Edm.Action, _dec(_class = (_class2 = class ProductsController extends _odataV4Server.ODataController {
    find(query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    findOne(key, query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            return yield db.collection("Products").findOne({ _id: new _mongodb.ObjectID(key) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    getCategory(result, query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            return yield db.collection("Categories").findOne({ _id: new _mongodb.ObjectID(result.CategoryId) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    setCategory(key, link) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(key)
            }, {
                $set: { CategoryId: new _mongodb.ObjectID(link) }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    unsetCategory(key) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(key)
            }, {
                $unset: { CategoryId: 1 }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    insert(data) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            if (data.CategoryId) data.CategoryId = new _mongodb.ObjectID(data.CategoryId);
            return yield db.collection("Products").insertOne(data).then(function (result) {
                data._id = result.insertedId;
                return data;
            });
        })();
    }

    upsert(key, data, context) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            if (data.CategoryId) data.CategoryId = new _mongodb.ObjectID(data.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new _mongodb.ObjectID(key) }, data, {
                upsert: true
            }).then(function (result) {
                data._id = result.upsertedId;
                return data;
            });
        })();
    }

    update(key, delta) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            if (delta.CategoryId) delta.CategoryId = new _mongodb.ObjectID(delta.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new _mongodb.ObjectID(key) }, { $set: delta }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    remove(key) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").deleteOne({ _id: new _mongodb.ObjectID(key) }).then(function (result) {
                return result.deletedCount;
            });
        })();
    }

    getCheapest() {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return (yield db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
        })();
    }

    getInPriceRange(min, max) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
        })();
    }

    swapPrice(a, b) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            const products = yield db.collection("Products").find({ _id: { $in: [new _mongodb.ObjectID(a), new _mongodb.ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
            const aProduct = products.find(function (product) {
                return product._id.toHexString() === a;
            });
            const bProduct = products.find(function (product) {
                return product._id.toHexString() === b;
            });
            yield db.collection("Products").update({ _id: new _mongodb.ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
            yield db.collection("Products").update({ _id: new _mongodb.ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
        })();
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "find", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "find"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "findOne", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "findOne"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCategory", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "getCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setCategory", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "setCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "unsetCategory", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "unsetCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "insert", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "insert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "upsert", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "upsert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "remove", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "remove"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCheapest", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "getCheapest"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getInPriceRange", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "getInPriceRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swapPrice", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "swapPrice"), _class2.prototype)), _class2)) || _class);
let CategoriesController = exports.CategoriesController = (_dec17 = _odataV4Server.odata.type(_model.Category), _dec18 = _odataV4Server.odata.GET, _dec19 = _odataV4Server.odata.GET, _dec20 = _odataV4Server.odata.GET("Products"), _dec21 = _odataV4Server.odata.GET("Products"), _dec22 = _odataV4Server.odata.POST("Products").$ref, _dec23 = _odataV4Server.odata.PUT("Products").$ref, _dec24 = _odataV4Server.odata.DELETE("Products").$ref, _dec25 = _odataV4Server.odata.POST, _dec26 = _odataV4Server.odata.PUT, _dec27 = _odataV4Server.odata.PATCH, _dec28 = _odataV4Server.odata.DELETE, _dec17(_class3 = (_class4 = class CategoriesController extends _odataV4Server.ODataController {
    find(query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            return yield db.collection("Categories").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    findOne(key, query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            return yield db.collection("Categories").findOne({ _id: new _mongodb.ObjectID(key) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    getProducts(result, query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] }, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    getProduct(key, result, query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").findOne({
                $and: [{ _id: new _mongodb.ObjectID(key), CategoryId: result._id }, mongodbQuery.query]
            }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    setCategory(key, link) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(link)
            }, {
                $set: { CategoryId: new _mongodb.ObjectID(key) }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    unsetCategory(key, link) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(link)
            }, {
                $unset: { CategoryId: 1 }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    insert(data) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").insertOne(data).then(function (result) {
                data._id = result.insertedId;
                return data;
            });
        })();
    }

    upsert(key, data) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").updateOne({ _id: new _mongodb.ObjectID(key) }, data, {
                upsert: true
            }).then(function (result) {
                data._id = result.upsertedId;
                return data;
            });
        })();
    }

    update(key, delta) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            if (delta.CategoryId) delta.CategoryId = new _mongodb.ObjectID(delta.CategoryId);
            return yield db.collection("Categories").updateOne({ _id: new _mongodb.ObjectID(key) }, { $set: delta }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    remove(key) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").deleteOne({ _id: new _mongodb.ObjectID(key) }).then(function (result) {
                return result.deletedCount;
            });
        })();
    }
}, (_applyDecoratedDescriptor(_class4.prototype, "find", [_dec18], Object.getOwnPropertyDescriptor(_class4.prototype, "find"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "findOne", [_dec19], Object.getOwnPropertyDescriptor(_class4.prototype, "findOne"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProducts", [_dec20], Object.getOwnPropertyDescriptor(_class4.prototype, "getProducts"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProduct", [_dec21], Object.getOwnPropertyDescriptor(_class4.prototype, "getProduct"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "setCategory", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class4.prototype, "setCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "unsetCategory", [_dec24], Object.getOwnPropertyDescriptor(_class4.prototype, "unsetCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "insert", [_dec25], Object.getOwnPropertyDescriptor(_class4.prototype, "insert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "upsert", [_dec26], Object.getOwnPropertyDescriptor(_class4.prototype, "upsert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "update", [_dec27], Object.getOwnPropertyDescriptor(_class4.prototype, "update"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "remove", [_dec28], Object.getOwnPropertyDescriptor(_class4.prototype, "remove"), _class4.prototype)), _class4)) || _class3);