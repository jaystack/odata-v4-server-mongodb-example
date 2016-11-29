"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const sql = require("mssql");
const dbConfig = {
    driver: "msnodesqlv8",
    server: "DESKTOP-SZABOF",
    database: "",
    user: "sa",
    password: "QWEasd123%"
};
var msSqlConnection = new sql.Connection(dbConfig);
const connection = msSqlConnection.connect();
function mssqlConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return connection;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mssqlConnection;
;
function mssqlRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield mssqlConnection();
        return new sql.Request(connection);
    });
}
exports.mssqlRequest = mssqlRequest;
//# sourceMappingURL=connection.js.map