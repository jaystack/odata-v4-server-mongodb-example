//import * as sql from "mssql";
const sql = require("mssql");

var dbConfig = { //Data Source=localhost\\SQLEXPRESS;Initial Catalog=mytest;Integrated Security=True
    server: "localhost\\MSSQLSERVER",
    database: "mytest",
    user: "sa",
    password: "QWEasd123%",
    port: 1433,
    options: {
        encrypt: true
    }
};

var msSqlConnection = new sql.Connection(dbConfig);

export default async function():Promise<any>{  // ??? connection type ???
    return await msSqlConnection.connect(dbConfig);
};