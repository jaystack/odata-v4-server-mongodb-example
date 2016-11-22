"use strict";
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
        var rl = readline.createInterface({
            input: fs.createReadStream(sqlFileName),
            terminal: false
        });
        rl.on('line', function (chunk) {
            const cmd = chunk.toString('ascii');
            console.log("#", cmd);
            // conn.query(chunk.toString('ascii'), function(err, sets, fields){
            // if(err) console.log(err);
            // else console.log(sets, fields);
            // });
            if (cmd && cmd.slice(0, 1) !== '#' && cmd.slice(0, 2) !== '//') {
                const req = new sql.Request(conn);
                req.query(cmd).then(function (recordset) {
                    console.log("##\n", recordset);
                    conn.close();
                })
                    .catch(function (err) {
                    console.log("##\n", err);
                    conn.close();
                });
            }
        });
        rl.on('close', function () {
            console.log("finished");
            if (SQLLang === 'MySql') {
                conn.end();
            }
        });
    })
        .catch((err) => console.log(err));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runSqlFile;
runSqlFile("c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example/src/mssql/sql.sql", "MsSql");
//# sourceMappingURL=runSqlFile.js.map