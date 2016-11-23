"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require("mongodb");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = _asyncToGenerator(function* () {
    const uri = process.env.NODE_ENV === "production" ? "mongodb://mongo/odata-v4-server-example" : "mongodb://localhost:27017/odata-v4-server-example";
    return yield _mongodb.MongoClient.connect(uri);
});