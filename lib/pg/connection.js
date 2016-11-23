"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pg = require("pg");
function promisify(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];
            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(...args, (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                });
            };
        }
    });
}
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg.Pool({
            user: 'postgres',
            password: 'postgres',
            database: 'postgres'
        });
        return new Promise((resolve, reject) => {
            pool.connect((err, client) => {
                if (err)
                    return reject(err);
                resolve(promisify(client));
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=connection.js.map