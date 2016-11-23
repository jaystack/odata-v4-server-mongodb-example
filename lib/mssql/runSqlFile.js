"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
//const mssql = require('mssql');
const fs = require('fs');
const readline = require('readline');
function runSqlFile(sqlFileName, SQLLang) {
    let sql;
    let conn;
    const myOptions = {
        host: 'localhost',
        port: '3306',
        database: '',
        user: '',
        password: ''
    };
    const msOptions = {
        server: "localhost\\MSSQLSERVER",
        database: "",
        user: "sa",
        password: "QWEasd123%",
        port: 1433,
        options: {
            encrypt: true
        }
    };
    if (SQLLang === 'MsSql') {
        sql = require('mssql');
        conn = new sql.Connection(msOptions);
        console.log(msOptions);
    }
    else if (SQLLang === 'MySql') {
        sql = require('mysql');
        conn = sql.createConnection(myOptions);
        console.log(myOptions);
    }
    conn.connect().then(function () {
        let cmd = "";
        const rl = readline.createInterface({
            input: fs.createReadStream(sqlFileName),
            terminal: false
        });
        rl.on('line', function (chunk) {
            return __awaiter(this, void 0, void 0, function* () {
                const line = chunk.toString('ascii');
                if (line) {
                    cmd = ((isCmdEnd(cmd)) ? "" : cmd) + line + " ";
                    if (isCmdEnd(cmd) || isComment(cmd)) {
                        console.log("=>", cmd);
                        if (!isComment(cmd)) {
                            try {
                                const result = yield runCmd(cmd, conn, sql);
                                console.log("--->", result);
                            }
                            catch (err) {
                                console.log("##ERROR\n", err);
                            }
                        }
                    }
                }
            });
        });
        rl.on('close', function () {
            console.log("finished");
            if (SQLLang === 'MsSql') {
                conn.close();
            }
            if (SQLLang === 'MySql') {
                conn.end();
            }
        });
    })
        .catch((err) => console.log(err));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runSqlFile;
function runCmd(cmd, conn, sql) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const req = new sql.Request(conn);
            console.log("CMD:", cmd);
            req.batch(cmd, (err, recordset) => {
                if (err) {
                    return reject(err);
                }
                if (recordset) {
                }
                //req.close();
                return resolve(recordset);
            });
        });
    });
}
function isComment(cmd) {
    return cmd && (cmd.slice(0, 1) === '#' || cmd.slice(0, 2) === '//' || cmd.slice(0, 2) === '--');
}
function isCmdEnd(cmd) {
    return cmd && cmd.trim().slice(-1) === ";";
}
runSqlFile("c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example/src/mssql/sql.sql", "MsSql");
//# sourceMappingURL=runSqlFile.js.map