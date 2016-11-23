import * as mysql from "mysql";

function promisify(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];

            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(...args, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            }
        }
    });
}

export default async function (): Promise<mysql.IConnection> {
    const db: mysql.IConnectionConfig = <mysql.IConnectionConfig>{
        "host": "localhost",
        "user": "root",
        "password": "mysql"
    };
    return await mysql.createConnection(db);
};