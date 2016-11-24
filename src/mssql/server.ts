import * as fs from 'fs';

import * as mssql from "mssql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mssqlConnection from "./connection";
import { Category, Product } from "./model";

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {

    @Edm.ActionImport
    async initDb() {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        const sqlCommands = fs.readFileSync("./src/mssql/mssql.sql","utf-8");
        await request.query(sqlCommands);
    }

    @Edm.ActionImport
    async testProduct() {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        const sqlCommand = "Select * From dbo.Products Where Id = 57";
        await new Promise<any>((resolve, reject) => {
            request.query(sqlCommand, (err, result) => {
                if (err) {
                    console.log("testProduct - err:", err);
                    return reject(err);
                }
                console.log("testProduct - result.slice(0, 2):", JSON.stringify(result.slice(0, 2), null, 2));
                console.log("testProduct - result.slice(-2) :", JSON.stringify(result.slice(-2), null, 2));
                console.log("testProduct - result.length:", result.length);
                console.log(sqlCommand);
                return resolve(result);
            });
        });
    }
}