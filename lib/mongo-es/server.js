"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NorthwindServer = undefined;

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

var _mongodb = require("mongodb");

var _odataV4Server = require("odata-v4-server");

var _controller = require("./controller");

var _connection = require("./connection");

var _connection2 = _interopRequireDefault(_connection);

var _model = require("./model");

var _categories = require("./categories");

var _categories2 = _interopRequireDefault(_categories);

var _products = require("./products");

var _products2 = _interopRequireDefault(_products);

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

let NorthwindServer = exports.NorthwindServer = (_dec = _odataV4Server.odata.namespace("Northwind"), _dec2 = _odataV4Server.odata.controller(_controller.ProductsController, true), _dec3 = _odataV4Server.odata.controller(_controller.CategoriesController, true), _dec4 = _odataV4Server.Edm.ActionImport, _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class NorthwindServer extends _odataV4Server.ODataServer {
    initDb() {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            yield db.dropDatabase();
            let categoryCollection = db.collection("Categories");
            let productsCollection = db.collection("Products");
            yield categoryCollection.insertMany(_categories2.default);
            yield productsCollection.insertMany(_products2.default);
        })();
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "initDb", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "initDb"), _class2.prototype)), _class2)) || _class) || _class) || _class);