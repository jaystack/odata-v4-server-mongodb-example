"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Category = exports.Product = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _class4, _desc2, _value2, _class5, _descriptor8, _descriptor9, _descriptor10, _descriptor11;

var _mongodb = require("mongodb");

var _odataV4Server = require("odata-v4-server");

var _connection = require("./connection");

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

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

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

let Product = exports.Product = (_dec = _odataV4Server.odata.namespace("NorthwindES"), _dec2 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Products"
}), _dec3 = _odataV4Server.Edm.Key, _dec4 = _odataV4Server.Edm.Computed, _dec5 = _odataV4Server.Edm.String, _dec6 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Product identifier"
}, {
    term: "UI.ControlHint",
    string: "ReadOnly"
}), _dec7 = _odataV4Server.Edm.String, _dec8 = _odataV4Server.Edm.Required, _dec9 = _odataV4Server.Edm.EntityType("Category"), _dec10 = _odataV4Server.Edm.Partner("Products"), _dec11 = _odataV4Server.Edm.Boolean, _dec12 = _odataV4Server.Edm.String, _dec13 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Product title"
}, {
    term: "UI.ControlHint",
    string: "ShortText"
}), _dec14 = _odataV4Server.Edm.String, _dec15 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Product English name"
}, {
    term: "UI.ControlHint",
    string: "ShortText"
}), _dec16 = _odataV4Server.Edm.Decimal, _dec17 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Unit price of product"
}, {
    term: "UI.ControlHint",
    string: "Decimal"
}), _dec18 = _odataV4Server.Edm.Function, _dec19 = _odataV4Server.Edm.Decimal, _dec20 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec21 = _odataV4Server.Edm.Action, _dec22 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec23 = _odataV4Server.Edm.Action, _dec24 = _odataV4Server.odata.parameter("result", _odataV4Server.odata.result), _dec25 = _odataV4Server.odata.parameter("value", _odataV4Server.Edm.Boolean), _dec(_class = _dec2(_class = (_class2 = class Product {
    constructor() {
        _initDefineProp(this, "_id", _descriptor, this);

        _initDefineProp(this, "CategoryId", _descriptor2, this);

        _initDefineProp(this, "Category", _descriptor3, this);

        _initDefineProp(this, "Discontinued", _descriptor4, this);

        _initDefineProp(this, "Name", _descriptor5, this);

        _initDefineProp(this, "QuantityPerUnit", _descriptor6, this);

        _initDefineProp(this, "UnitPrice", _descriptor7, this);
    }

    getUnitPrice(result) {
        return result.UnitPrice;
    }

    invertDiscontinued(result) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            yield db.collection('Products').findOneAndUpdate({ _id: result._id }, { $set: { Discontinued: !result.Discontinued } });
        })();
    }

    setDiscontinued(result, value) {
        return _asyncToGenerator(function* () {
            let db = yield (0, _connection2.default)();
            yield db.collection('Products').findOneAndUpdate({ _id: result._id }, { $set: { Discontinued: value } });
        })();
    }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_id", [_dec3, _dec4, _dec5, _dec6], {
    enumerable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "CategoryId", [_dec7, _dec8], {
    enumerable: true,
    initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "Category", [_dec9, _dec10], {
    enumerable: true,
    initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "Discontinued", [_dec11], {
    enumerable: true,
    initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "Name", [_dec12, _dec13], {
    enumerable: true,
    initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "QuantityPerUnit", [_dec14, _dec15], {
    enumerable: true,
    initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "UnitPrice", [_dec16, _dec17], {
    enumerable: true,
    initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, "getUnitPrice", [_dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "getUnitPrice"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "invertDiscontinued", [_dec21, _dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "invertDiscontinued"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "setDiscontinued", [_dec23, _dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "setDiscontinued"), _class2.prototype)), _class2)) || _class) || _class);
let Category = exports.Category = (_dec26 = _odataV4Server.odata.namespace("NorthwindES"), _dec27 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Categories"
}), _dec28 = _odataV4Server.Edm.Key, _dec29 = _odataV4Server.Edm.Computed, _dec30 = _odataV4Server.Edm.String, _dec31 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Category identifier"
}, {
    term: "UI.ControlHint",
    string: "ReadOnly"
}), _dec32 = _odataV4Server.Edm.String, _dec33 = _odataV4Server.Edm.String, _dec34 = _odataV4Server.Edm.Annotate({
    term: "UI.DisplayName",
    string: "Category name"
}, {
    term: "UI.ControlHint",
    string: "ShortText"
}), _dec35 = _odataV4Server.Edm.Collection(_odataV4Server.Edm.EntityType("Product")), _dec36 = _odataV4Server.Edm.Partner("Category"), _dec26(_class4 = _dec27(_class4 = (_class5 = class Category {
    constructor() {
        _initDefineProp(this, "_id", _descriptor8, this);

        _initDefineProp(this, "Description", _descriptor9, this);

        _initDefineProp(this, "Name", _descriptor10, this);

        _initDefineProp(this, "Products", _descriptor11, this);
    }

}, (_descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "_id", [_dec28, _dec29, _dec30, _dec31], {
    enumerable: true,
    initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "Description", [_dec32], {
    enumerable: true,
    initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "Name", [_dec33, _dec34], {
    enumerable: true,
    initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "Products", [_dec35, _dec36], {
    enumerable: true,
    initializer: null
})), _class5)) || _class4) || _class4);