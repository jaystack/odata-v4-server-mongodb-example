var sql = require('mssql');
var runSqlFile = require('./runSqlFile');

var dbConfig = { //Data Source=HARIHARAN-PC\\SQLEXPRESS;Initial Catalog=yourDataBaseName;Integrated Security=True
    server: "localhost\\MSSQLSERVER",
    database: "mytest",
    user: "sa",
    password: "QWEasd123%",
    port: 1433,
    options: {
        encrypt: true
    }
};

var conn = new sql.Connection(dbConfig);
console.log("HALIHÓ 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

conn.connect().then(function () {
    console.log("HALIHÓ 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    var req = new sql.Request(conn);
    req.query("SELECT * FROM mytest.dbo.t1").then(function (recordset) {
        console.log(recordset);
        conn.close();
    })
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
})
.catch(function (err) {
    console.log(err);
});

runSqlFile("c:\_CODE\odata-v4-server\odata-v4-server-mongodb-example\src\mssql\sql.sql", "MsSql");

// sql.connect("mssql://sa:@localhost/test").then(function() {
//     // Query

//     new sql.Request().query('SELECT name FROM master.dbo.sysdatabases').then(function(recordset) {
//         console.dir(recordset);
//     }).catch(function(err) {
//         // ... query error checks
//     });

//     // // Stored Procedure

//     // const value = 42;
//     // new sql.Request()
//     // .input('input_parameter', sql.Int, value)
//     // .output('output_parameter', sql.VarChar(50))
//     // .execute('procedure_name').then(function(recordsets) {
//     //     console.dir(recordsets);
//     // }).catch(function(err) {
//     //     // ... execute error checks
//     // });

//     // // ES6 Tagged template literals (experimental)

//     // sql.query`select * from mytable where id = ${value}`.then(function(recordset) {
//     //     console.dir(recordset);
//     // }).catch(function(err) {
//     //     // ... query error checks
//     // });
// }).catch(function(err) {
//     // ... connect error checks
// });