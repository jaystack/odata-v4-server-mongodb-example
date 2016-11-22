"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mysql = require("mysql");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        /*const connection = mysql.createConnection({
            host: 'localhost',
            user: 'me',
            password: 'secret',
            database: 'my_db'
        });
    
        return await connection.connect();*/
        const db = {
            "host": "localhost",
            "user": "db",
            "password": "***",
            "database": "world"
        };
        return yield mysql.createConnection(db);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=connection.js.map