import * as mysql from "mysql";

export default async function (): Promise<mysql.IConnection> {
    const db: mysql.IConnectionConfig = <mysql.IConnectionConfig>{
        "host": "localhost",
        "user": "root",
        "password": "mysql"
    };
    return await mysql.createConnection(db);
};