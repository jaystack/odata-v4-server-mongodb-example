//import * as sql from "mssql";
const sql = require("mssql");

var dbConfig = { //Data Source=localhost\\SQLEXPRESS;Initial Catalog=mytest;Integrated Security=True
    server: "localhost\\MSSQLSERVER",
    database: "",
    user: "sa",
    password: "QWEasd123%",
    port: 1433,
    options: {
        encrypt: true
    },
    requestTimeout: 1000
};

var msSqlConnection = new sql.Connection(dbConfig);
const connection = msSqlConnection.connect();

export default async function():Promise<any>{  // ??? connection type ???
    //return await msSqlConnection.connect();
    return connection;
};