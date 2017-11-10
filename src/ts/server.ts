import { ObjectID } from "mongodb";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import * as ODataParserPro from "odata-v4-parser-pro";
import * as ODataMongoDBPro from "odata-v4-mongodb-pro";
import * as ODataValidator from "odata-v4-validator";
import { ValidatorOptions, AllowedQueryOptions } from "odata-v4-validator";
import { ProductsController, CategoriesController } from "./controller";
import connect from "./connect";
import { Category } from "./model";
import categories from "./categories";
import products from "./products";

class NorthwindContainer{
    @Edm.String
    @Edm.URLDeserialize((value: string) => new ObjectID(value))
    @Edm.Deserialize(value => new ObjectID(value))
    ObjectID = ObjectID
}

@odata.cors
@odata.parser(ODataParserPro)
@odata.connector(ODataMongoDBPro)
@odata.validation(ODataValidator, <ValidatorOptions>{
    AllowedQueryOptions: AllowedQueryOptions.Filter | AllowedQueryOptions.Top,
    MaxTop: 5
})
@Edm.Container(NorthwindContainer)
@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){
        const db = await connect();
        await db.dropDatabase();

        let now = new Date();
        let cats = categories.map((c:any) => {
            c.CreatedAt = now;
            return c;
        });
        console.log(cats);
        await db.collection("Categories").insertMany(cats);

        let prods = products.map((p:any) => {
            p.CreatedAt = now;
            return p;
        });
        await db.collection("Products").insertMany(prods);
    }
}

process.on("warning", warning => {
    console.log(warning.stack);
});