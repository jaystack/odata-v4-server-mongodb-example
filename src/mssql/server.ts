import * as fs from 'fs';

import * as mssql from "mssql";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mssqlConnection from "./connection";
import { Category, Product } from "./model";
const categories: Category[] = require("../../src/mssql/categories");
const products: Product[] = require("../../src/mssql/products");

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
}