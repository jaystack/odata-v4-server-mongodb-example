//import * as sql from "mssql";
const sql = require("mssql");

const dbConfig = {
    driver: "msnodesqlv8", // very important // alternate value "tedious",
    server: "DESKTOP-SZABOF",  // very important // sometimes these don't work: "localhost" or "localhost\\MSSQLSERVER",
    database: "northwind_mssql_test_db", // very important
    user: "sa",
    password: "QWEasd123%"
    // , port: 1433
    // , options: {
    //     encrypt: true
    // }
    // , requestTimeout: 15000
};

var msSqlConnection = new sql.Connection(dbConfig);
const connection = msSqlConnection.connect();

export default async function():Promise<any> {
    return connection;
};