var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var sql = require('mssql');
var mssql = sql;
//var runSqlFile = require('./runSqlFile');
// import { Category, Product } from "./model";
// const categories: Category[] = require("../../src/mssql/categories");
// const products: Product[] = require("../../src/mssql/products");
const dbConfig = {
    driver: "msnodesqlv8",
    server: "DESKTOP-SZABOF",
    database: "northwind_mssql_test_db",
    user: "sa",
    password: "QWEasd123%",
    port: 1433,
    options: {
        encrypt: true
    },
    requestTimeout: 15000
};
var conn = new sql.Connection(dbConfig);
console.log("HALIHÓ 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
conn.connect().then(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("HALIHÓ 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        var req = new sql.Request(conn);
        req.query("SELECT * FROM mytest.dbo.t1").then(function (recordset) {
            console.log(recordset);
            //conn.close();
        })
            .catch(function (err) {
            console.log(err);
            //conn.close();
        });
        // /////
        let myResultsI = yield new Promise((resolve, reject) => runQuery(mssql, conn, resolve, reject, "INSERT INTO mytest.dbo.t1 OUTPUT inserted.* Values(5, 'FIVE')", true));
        console.log("INSERT:", JSON.stringify(myResultsI, null, 2));
        let myResultsD = yield new Promise((resolve, reject) => runQuery(mssql, conn, resolve, reject, "DELETE From mytest.dbo.t1 Output deleted.* Where id = 5", true));
        console.log("DELETE:", JSON.stringify(myResultsD, null, 2));
        let sqlCommand = `DECLARE @impactedId INT;
        UPDATE mytest.dbo.t1 SET text = 'UPDATED HI', @impactedId = id WHERE id = 2;
        SELECT @impactedId as 'ImpactedId';`;
        let myResultsU = yield new Promise((resolve, reject) => runQuery(mssql, conn, resolve, reject, sqlCommand, true));
        console.log("UPDATE:", JSON.stringify(myResultsU, null, 2));
        // /////
        // TOP(1) nélkül 6272 db-ot ad vissza, de legalább jó sorrendben
        let myResultsGetCheapest = yield new Promise((resolve, reject) => runQuery(mssql, conn, resolve, reject, "SELECT TOP(1) * FROM Products ORDER BY UnitPrice ASC", true));
        console.log("getCheapest:", JSON.stringify(myResultsGetCheapest, null, 2));
        console.log("getCheapest length:", myResultsGetCheapest.length);
        myResultsGetCheapest = yield new Promise((resolve, reject) => runQuery(mssql, conn, resolve, reject, "SELECT TOP(1) * FROM Products ORDER BY UnitPrice ASC", true));
        console.log("getCheapest:", JSON.stringify(myResultsGetCheapest, null, 2));
        console.log("getCheapest length:", myResultsGetCheapest.length);
    });
});
function runQuery(mssql, connection, resolve, reject, query, goOn = false) {
    return (new mssql.Request(connection)).query(query, (err, result) => {
        if (err) {
            console.log("ERR:", query, ":\n", err);
            return (goOn) ? resolve(err) : reject(err);
        }
        console.log("OK:", query);
        if (result) {
            console.log(result);
        }
        return resolve(result);
    });
}
//runSqlFile("c:\_CODE\odata-v4-server\odata-v4-server-mongodb-example\src\mssql\sql.sql", "MsSql");
//# sourceMappingURL=__example.js.map