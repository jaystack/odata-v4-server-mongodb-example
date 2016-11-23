"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CategoriesController = exports.ProductsController = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _class, _desc, _value, _class2, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _dec58, _dec59, _dec60, _dec61, _dec62, _dec63, _dec64, _dec65, _dec66, _class3, _desc2, _value2, _class4;

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

let ProductsController = exports.ProductsController = (_dec = _odataV4Server.odata.type(_model.Product), _dec2 = _odataV4Server.odata.GET, _dec3 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec4 = _odataV4Server.odata.GET, _dec5 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec6 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec7 = _odataV4Server.odata.GET("Category"), _dec8 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec9 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec10 = _odataV4Server.odata.POST("Category").$ref, _dec11 = _odataV4Server.odata.PUT("Category").$ref, _dec12 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec13 = _odataV4Server.odata.parameter("link", _odataV4Server.odata.link), _dec14 = _odataV4Server.odata.DELETE("Category").$ref, _dec15 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec16 = _odataV4Server.odata.POST, _dec17 = _odataV4Server.odata.parameter("data", _odataV4Server.odata.body), _dec18 = _odataV4Server.odata.PUT, _dec19 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec20 = _odataV4Server.odata.parameter("data", _odataV4Server.odata.body), _dec21 = _odataV4Server.odata.parameter("context", _odataV4Server.odata.context), _dec22 = _odataV4Server.odata.PATCH, _dec23 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec24 = _odataV4Server.odata.parameter("delta", _odataV4Server.odata.body), _dec25 = _odataV4Server.odata.DELETE, _dec26 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec27 = _odataV4Server.Edm.Function, _dec28 = _odataV4Server.Edm.EntityType(_model.Product), _dec29 = _odataV4Server.Edm.Function, _dec30 = _odataV4Server.Edm.Collection(_odataV4Server.Edm.EntityType(_model.Product)), _dec31 = _odataV4Server.odata.parameter("min", _odataV4Server.Edm.Decimal, "max", _odataV4Server.Edm.Decimal), _dec32 = _odataV4Server.Edm.Action, _dec33 = _odataV4Server.odata.parameter("a", _odataV4Server.Edm.String, "b", _odataV4Server.Edm.String), _dec34 = _odataV4Server.Edm.Action, _dec35 = _odataV4Server.odata.parameter("productId", _odataV4Server.Edm.String), _dec36 = _odataV4Server.odata.parameter("percent", _odataV4Server.Edm.Int32), _dec(_class = (_class2 = class ProductsController extends _odataV4Server.ODataController {
    find(query) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(query);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").find(mongodbQuery.query).project(mongodbQuery.projection).skip(mongodbQuery.skip || 0).limit(mongodbQuery.limit || 0).sort(mongodbQuery.sort).toArray();
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

    discountProduct(productId, percent) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            const product = yield db.collection("Products").findOne({ _id: new _mongodb.ObjectID(productId) });
            const discountedPrice = (100 - percent) / 100 * product.UnitPrice;
            yield db.collection("Products").update({ _id: new _mongodb.ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
        })();
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "find", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "find"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "findOne", [_dec4, _dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "findOne"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCategory", [_dec7, _dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "getCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setCategory", [_dec10, _dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "setCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "unsetCategory", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "unsetCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "insert", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "insert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "upsert", [_dec18, _dec19, _dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "upsert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec22, _dec23, _dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "remove", [_dec25, _dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "remove"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCheapest", [_dec27, _dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "getCheapest"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getInPriceRange", [_dec29, _dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "getInPriceRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swapPrice", [_dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "swapPrice"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "discountProduct", [_dec34, _dec35, _dec36], Object.getOwnPropertyDescriptor(_class2.prototype, "discountProduct"), _class2.prototype)), _class2)) || _class);
let CategoriesController = exports.CategoriesController = (_dec37 = _odataV4Server.odata.type(_model.Category), _dec38 = _odataV4Server.odata.GET, _dec39 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec40 = _odataV4Server.odata.GET, _dec41 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec42 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec43 = _odataV4Server.odata.GET("Products"), _dec44 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec45 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec46 = _odataV4Server.odata.GET("Products"), _dec47 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec48 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec49 = _odataV4Server.odata.parameter("query", _odataV4Server.odata.query), _dec50 = _odataV4Server.odata.POST("Products").$ref, _dec51 = _odataV4Server.odata.PUT("Products").$ref, _dec52 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec53 = _odataV4Server.odata.parameter("link", _odataV4Server.odata.link), _dec54 = _odataV4Server.odata.DELETE("Products").$ref, _dec55 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec56 = _odataV4Server.odata.parameter("link", _odataV4Server.odata.link), _dec57 = _odataV4Server.odata.POST, _dec58 = _odataV4Server.odata.parameter("data", _odataV4Server.odata.body), _dec59 = _odataV4Server.odata.PUT, _dec60 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec61 = _odataV4Server.odata.parameter("data", _odataV4Server.odata.body), _dec62 = _odataV4Server.odata.PATCH, _dec63 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec64 = _odataV4Server.odata.parameter("delta", _odataV4Server.odata.body), _dec65 = _odataV4Server.odata.DELETE, _dec66 = _odataV4Server.odata.parameter("key", _odataV4Server.odata.key), _dec37(_class3 = (_class4 = class CategoriesController extends _odataV4Server.ODataController {
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
}, (_applyDecoratedDescriptor(_class4.prototype, "find", [_dec38, _dec39], Object.getOwnPropertyDescriptor(_class4.prototype, "find"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "findOne", [_dec40, _dec41, _dec42], Object.getOwnPropertyDescriptor(_class4.prototype, "findOne"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProducts", [_dec43, _dec44, _dec45], Object.getOwnPropertyDescriptor(_class4.prototype, "getProducts"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProduct", [_dec46, _dec47, _dec48, _dec49], Object.getOwnPropertyDescriptor(_class4.prototype, "getProduct"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "setCategory", [_dec50, _dec51, _dec52, _dec53], Object.getOwnPropertyDescriptor(_class4.prototype, "setCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "unsetCategory", [_dec54, _dec55, _dec56], Object.getOwnPropertyDescriptor(_class4.prototype, "unsetCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "insert", [_dec57, _dec58], Object.getOwnPropertyDescriptor(_class4.prototype, "insert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "upsert", [_dec59, _dec60, _dec61], Object.getOwnPropertyDescriptor(_class4.prototype, "upsert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "update", [_dec62, _dec63, _dec64], Object.getOwnPropertyDescriptor(_class4.prototype, "update"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "remove", [_dec65, _dec66], Object.getOwnPropertyDescriptor(_class4.prototype, "remove"), _class4.prototype)), _class4)) || _class3);