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

let ProductsController = (_dec = _odataV4Server.odata.type(_model.Product), _dec2 = _odataV4Server.odata.GET, _dec3 = _odataV4Server.odata.GET, _dec4 = _odataV4Server.odata.GET("Category"), _dec5 = _odataV4Server.odata.POST("Category").$ref, _dec6 = _odataV4Server.odata.PUT("Category").$ref, _dec7 = _odataV4Server.odata.DELETE("Category").$ref, _dec8 = _odataV4Server.odata.POST, _dec9 = _odataV4Server.odata.PUT, _dec10 = _odataV4Server.odata.PATCH, _dec11 = _odataV4Server.odata.DELETE, _dec12 = _odataV4Server.Edm.Function, _dec13 = _odataV4Server.Edm.EntityType(_model.Product), _dec14 = _odataV4Server.Edm.Function, _dec15 = _odataV4Server.Edm.Collection(_odataV4Server.Edm.EntityType(_model.Product)), _dec16 = _odataV4Server.Edm.Action, _dec(_class = (_class2 = class ProductsController extends _odataV4Server.ODataController {
    find(_query) {
        return _asyncToGenerator(function* () {
            var _query2 = _odataV4Server.odata.query(_query);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query2);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    findOne(_key, _query3) {
        return _asyncToGenerator(function* () {
            var _key2 = _odataV4Server.odata.key(_key);

            var _query4 = _odataV4Server.odata.query(_query3);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query4);
            return yield db.collection("Products").findOne({ _id: new _mongodb.ObjectID(_key2) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    getCategory(_result, _query5) {
        return _asyncToGenerator(function* () {
            var _result2 = _odataV4Server.odata.result(_result);

            var _query6 = _odataV4Server.odata.query(_query5);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query6);
            return yield db.collection("Categories").findOne({ _id: new _mongodb.ObjectID(_result2.CategoryId) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    setCategory(_key3, _link) {
        return _asyncToGenerator(function* () {
            var _key4 = _odataV4Server.odata.key(_key3);

            var _link2 = _odataV4Server.odata.link(_link);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(_key4)
            }, {
                $set: { CategoryId: new _mongodb.ObjectID(_link2) }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    unsetCategory(_key5) {
        return _asyncToGenerator(function* () {
            var _key6 = _odataV4Server.odata.key(_key5);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(_key6)
            }, {
                $unset: { CategoryId: 1 }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    insert(_data) {
        return _asyncToGenerator(function* () {
            var _data2 = _odataV4Server.odata.body(_data);

            let db = yield (0, _connection2.default)();
            if (_data2.CategoryId) _data2.CategoryId = new _mongodb.ObjectID(_data2.CategoryId);
            return yield db.collection("Products").insertOne(_data2).then(function (result) {
                _data2._id = result.insertedId;
                return _data2;
            });
        })();
    }

    upsert(_key7, _data3, _context) {
        return _asyncToGenerator(function* () {
            var _key8 = _odataV4Server.odata.key(_key7);

            var _data4 = _odataV4Server.odata.body(_data3);

            var _context2 = _odataV4Server.odata.context(_context);

            let db = yield (0, _connection2.default)();
            if (_data4.CategoryId) _data4.CategoryId = new _mongodb.ObjectID(_data4.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new _mongodb.ObjectID(_key8) }, _data4, {
                upsert: true
            }).then(function (result) {
                _data4._id = result.upsertedId;
                return _data4;
            });
        })();
    }

    update(_key9, _delta) {
        return _asyncToGenerator(function* () {
            var _key10 = _odataV4Server.odata.key(_key9);

            var _delta2 = _odataV4Server.odata.body(_delta);

            let db = yield (0, _connection2.default)();
            if (_delta2.CategoryId) _delta2.CategoryId = new _mongodb.ObjectID(_delta2.CategoryId);
            return yield db.collection("Products").updateOne({ _id: new _mongodb.ObjectID(_key10) }, { $set: _delta2 }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    remove(_key11) {
        return _asyncToGenerator(function* () {
            var _key12 = _odataV4Server.odata.key(_key11);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").deleteOne({ _id: new _mongodb.ObjectID(_key12) }).then(function (result) {
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

    getInPriceRange(_min, _max) {
        return _asyncToGenerator(function* () {
            var _min2 = _odataV4Server.Edm.Decimal(_min);

            var _max2 = _odataV4Server.Edm.Decimal(_max);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
        })();
    }

    swapPrice(_a, _b) {
        return _asyncToGenerator(function* () {
            var _a2 = _odataV4Server.Edm.String(_a);

            var _b2 = _odataV4Server.Edm.String(_b);

            let db = yield (0, _connection2.default)();
            const products = yield db.collection("Products").find({ _id: { $in: [new _mongodb.ObjectID(_a2), new _mongodb.ObjectID(_b2)] } }, { UnitPrice: 1 }).toArray();
            const aProduct = products.find(function (product) {
                return product._id.toHexString() === _a2;
            });
            const bProduct = products.find(function (product) {
                return product._id.toHexString() === _b2;
            });
            yield db.collection("Products").update({ _id: new _mongodb.ObjectID(_a2) }, { $set: { UnitPrice: bProduct.UnitPrice } });
            yield db.collection("Products").update({ _id: new _mongodb.ObjectID(_b2) }, { $set: { UnitPrice: aProduct.UnitPrice } });
        })();
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "find", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "find"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "findOne", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "findOne"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCategory", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "getCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setCategory", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "setCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "unsetCategory", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "unsetCategory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "insert", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "insert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "upsert", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "upsert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "remove", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "remove"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCheapest", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "getCheapest"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getInPriceRange", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "getInPriceRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swapPrice", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "swapPrice"), _class2.prototype)), _class2)) || _class);
exports.ProductsController = ProductsController;
let CategoriesController = (_dec17 = _odataV4Server.odata.type(_model.Category), _dec18 = _odataV4Server.odata.GET, _dec19 = _odataV4Server.odata.GET, _dec20 = _odataV4Server.odata.GET("Products"), _dec21 = _odataV4Server.odata.GET("Products"), _dec22 = _odataV4Server.odata.POST("Products").$ref, _dec23 = _odataV4Server.odata.PUT("Products").$ref, _dec24 = _odataV4Server.odata.DELETE("Products").$ref, _dec25 = _odataV4Server.odata.POST, _dec26 = _odataV4Server.odata.PUT, _dec27 = _odataV4Server.odata.PATCH, _dec28 = _odataV4Server.odata.DELETE, _dec17(_class3 = (_class4 = class CategoriesController extends _odataV4Server.ODataController {
    find(_query10) {
        return _asyncToGenerator(function* () {
            var _query11 = _odataV4Server.odata.query(_query10);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query11);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            return yield db.collection("Categories").find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    findOne(_key19, _query12) {
        return _asyncToGenerator(function* () {
            var _key20 = _odataV4Server.odata.key(_key19);

            var _query13 = _odataV4Server.odata.query(_query12);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query13);
            return yield db.collection("Categories").findOne({ _id: new _mongodb.ObjectID(_key20) }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    getProducts(_result16, _query14) {
        return _asyncToGenerator(function* () {
            var _result17 = _odataV4Server.odata.result(_result16);

            var _query15 = _odataV4Server.odata.query(_query14);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query15);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").find({ $and: [{ CategoryId: _result17._id }, mongodbQuery.query] }, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit).toArray();
        })();
    }

    getProduct(_key21, _result18, _query16) {
        return _asyncToGenerator(function* () {
            var _key22 = _odataV4Server.odata.key(_key21);

            var _result19 = _odataV4Server.odata.result(_result18);

            var _query17 = _odataV4Server.odata.query(_query16);

            let db = yield (0, _connection2.default)();
            let mongodbQuery = (0, _odataV4Mongodb.createQuery)(_query17);
            if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new _mongodb.ObjectID(mongodbQuery.query._id);
            if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new _mongodb.ObjectID(mongodbQuery.query.CategoryId);
            return yield db.collection("Products").findOne({
                $and: [{ _id: new _mongodb.ObjectID(_key22), CategoryId: _result19._id }, mongodbQuery.query]
            }, {
                fields: mongodbQuery.projection
            });
        })();
    }

    setCategory(_key23, _link4) {
        return _asyncToGenerator(function* () {
            var _key24 = _odataV4Server.odata.key(_key23);

            var _link5 = _odataV4Server.odata.link(_link4);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(_link5)
            }, {
                $set: { CategoryId: new _mongodb.ObjectID(_key24) }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    unsetCategory(_key25, _link6) {
        return _asyncToGenerator(function* () {
            var _key26 = _odataV4Server.odata.key(_key25);

            var _link7 = _odataV4Server.odata.link(_link6);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Products").updateOne({
                _id: new _mongodb.ObjectID(_link7)
            }, {
                $unset: { CategoryId: 1 }
            }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    insert(_data7) {
        return _asyncToGenerator(function* () {
            var _data8 = _odataV4Server.odata.body(_data7);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").insertOne(_data8).then(function (result) {
                _data8._id = result.insertedId;
                return _data8;
            });
        })();
    }

    upsert(_key27, _data9) {
        return _asyncToGenerator(function* () {
            var _key28 = _odataV4Server.odata.key(_key27);

            var _data10 = _odataV4Server.odata.body(_data9);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").updateOne({ _id: new _mongodb.ObjectID(_key28) }, _data10, {
                upsert: true
            }).then(function (result) {
                _data10._id = result.upsertedId;
                return _data10;
            });
        })();
    }

    update(_key29, _delta4) {
        return _asyncToGenerator(function* () {
            var _key30 = _odataV4Server.odata.key(_key29);

            var _delta5 = _odataV4Server.odata.body(_delta4);

            let db = yield (0, _connection2.default)();
            if (_delta5.CategoryId) _delta5.CategoryId = new _mongodb.ObjectID(_delta5.CategoryId);
            return yield db.collection("Categories").updateOne({ _id: new _mongodb.ObjectID(_key30) }, { $set: _delta5 }).then(function (result) {
                return result.modifiedCount;
            });
        })();
    }

    remove(_key31) {
        return _asyncToGenerator(function* () {
            var _key32 = _odataV4Server.odata.key(_key31);

            let db = yield (0, _connection2.default)();
            return yield db.collection("Categories").deleteOne({ _id: new _mongodb.ObjectID(_key32) }).then(function (result) {
                return result.deletedCount;
            });
        })();
    }
}, (_applyDecoratedDescriptor(_class4.prototype, "find", [_dec18], Object.getOwnPropertyDescriptor(_class4.prototype, "find"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "findOne", [_dec19], Object.getOwnPropertyDescriptor(_class4.prototype, "findOne"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProducts", [_dec20], Object.getOwnPropertyDescriptor(_class4.prototype, "getProducts"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "getProduct", [_dec21], Object.getOwnPropertyDescriptor(_class4.prototype, "getProduct"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "setCategory", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class4.prototype, "setCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "unsetCategory", [_dec24], Object.getOwnPropertyDescriptor(_class4.prototype, "unsetCategory"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "insert", [_dec25], Object.getOwnPropertyDescriptor(_class4.prototype, "insert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "upsert", [_dec26], Object.getOwnPropertyDescriptor(_class4.prototype, "upsert"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "update", [_dec27], Object.getOwnPropertyDescriptor(_class4.prototype, "update"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "remove", [_dec28], Object.getOwnPropertyDescriptor(_class4.prototype, "remove"), _class4.prototype)), _class4)) || _class3);
exports.CategoriesController = CategoriesController;