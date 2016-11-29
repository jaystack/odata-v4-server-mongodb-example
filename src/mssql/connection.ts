const sql = require("mssql");

const dbConfig = {
    driver: "msnodesqlv8", // alternate value "tedious", // should be installed by 'npm install msnodesqlv8' / 'npm install tedious'
    server: "DESKTOP-SZABOF",  // very important // sometimes these don't work: "localhost" or "localhost\\MSSQLSERVER",
    database: "", // "northwind_mssql_test_db"
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

export default async function mssqlConnection(): Promise<any> {
    return connection;
};

export async function mssqlRequest(): Promise<any> {
    const connection = await mssqlConnection();
    return new sql.Request(connection);
}