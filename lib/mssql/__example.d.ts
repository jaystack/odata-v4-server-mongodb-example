declare var sql: any;
declare var mssql: any;
declare var dbConfig: {
    server: string;
    database: string;
    user: string;
    password: string;
    port: number;
    supportBigNumbers: boolean;
    bigNumberStrings: boolean;
    options: {
        encrypt: boolean;
    };
    requestTimeout: number;
};
declare var conn: any;
declare function runQuery(mssql: any, connection: any, resolve: Function, reject: Function, query: string, goOn?: boolean): any;
