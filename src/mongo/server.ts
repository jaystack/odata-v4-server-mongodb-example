import { ObjectID } from "mongodb";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
import mongodb from "./connection";
import { Category } from "./model";
import categories from "./categories";
import products from "./products";

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){
        const db = await mongodb();
        await db.dropDatabase();
        await db.collection("Categories").insertMany(categories);
        await db.collection("Products").insertMany(products);
    }
}