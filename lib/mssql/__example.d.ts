declare var sql: any;
declare var mssql: any;
declare var dbConfig: {
    server: string;
    database: string;
    user: string;
    password: string;
    port: number;
    options: {
        encrypt: boolean;
    };
    requestTimeout: number;
};
declare var conn: any;
