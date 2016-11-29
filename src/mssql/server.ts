import * as fs from 'fs';
import * as mssql from "mssql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import { mssqlRequest, default as mssqlConnection } from "./connection";
import { Category, Product } from "./model";

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {

    @Edm.ActionImport
    async initDb() {
        let request = await mssqlRequest();
        const sqlCommands = fs.readFileSync("./src/mssql/mssql.sql","utf-8");
        await request.query(sqlCommands);
    }
}