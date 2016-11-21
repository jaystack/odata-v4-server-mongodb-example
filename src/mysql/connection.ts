import * as mysql from "mysql";

export default async function (): Promise<mysql.IConnection> {
    /*const connection = mysql.createConnection({
        host: 'localhost',
        user: 'me',
        password: 'secret',
        database: 'my_db'
    });

    return await connection.connect();*/

    const db: mysql.IConnectionConfig = <mysql.IConnectionConfig>{
        "host": "localhost",
        "user": "db",
        "password": "***",
        "database": "world"
    };
    return await mysql.createConnection(db);
};