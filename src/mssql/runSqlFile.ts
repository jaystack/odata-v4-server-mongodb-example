//const mssql = require('mssql');
import * as fs from 'fs';
import * as readline from 'readline';

export default function runSqlFile(sqlFileName: string, SQLLang: string) {
  let sql: any;
  let conn: any;

  const myOptions = {
    host: 'localhost',
    port: '3306',
    database: '',
    user: '',
    password: ''
  };

  const msOptions = {
  server: "localhost\\MSSQLSERVER", // "localhost\\MSSQLSERVER",
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
  } else if (SQLLang === 'MySql') {
    sql = require('mysql');
    conn = sql.createConnection(myOptions);
    console.log(myOptions);
  }

  conn.connect().then(function () {
    var rl = readline.createInterface({
      input: fs.createReadStream(sqlFileName),
      terminal: false
    });
    rl.on('line', function(chunk){
        const cmd = chunk.toString('ascii');
        console.log("#", cmd);
        // conn.query(chunk.toString('ascii'), function(err, sets, fields){
        // if(err) console.log(err);
        // else console.log(sets, fields);
        // });
        if (cmd && cmd.slice(0,1) !== '#' && cmd.slice(0,2) !== '//') {
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
    rl.on('close', function(){
      console.log("finished");
      if (SQLLang === 'MySql') { conn.end(); }
    });
  })
  .catch((err: Error) => console.log(err));
}

runSqlFile("c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example/src/mssql/sql.sql", "MsSql");