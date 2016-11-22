//import { ObjectID } from "mongodb";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, CategoriesController } from "./controller";
//import mongodb from "./connection";
import msSql from "./connection";
import { Category } from "./model";
import categories from "./categories";
import products from "./products";

@odata.namespace("Northwinds")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){
        //let db = await mongodb();
        let db = await msSql();
        // await db.dropDatabase();
        // let categoryCollection = db.collection("Categories");
        // let productsCollection = db.collection("Products");
        // await categoryCollection.insertMany(categories);
        // await productsCollection.insertMany(products);
        // ??? Na ezeket hogyan SQL Server esetén ???
    }
}