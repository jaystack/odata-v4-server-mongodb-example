import { ObjectID } from "mongodb";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController, /*CategoriesController*/ } from "./controller";
import connect from "./connect";
import categories  from "./categories";
import products from "./products";
import multipleInsert from "./utils/multipleInsert";

@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
//@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer {
    
	@Edm.ActionImport
    async initDb(){
        const db = await connect();
		
		await db.query(`DROP TABLE IF EXISTS "Categories", "Products"`);
		
		await db.query(`CREATE TABLE "Categories" (
							"Id" INT PRIMARY KEY,
							"Name" VARCHAR(14),
							"Description" VARCHAR(25)
						);`);
		
		await db.query(`CREATE TABLE "Products" (
							"Id" INT PRIMARY KEY,
							"Name" VARCHAR(32),
							"QuantityPerUnit" VARCHAR(20),
							"UnitPrice" NUMERIC(5,2),
							"CategoryId" INT REFERENCES "Categories",
							"Discontinued" BOOLEAN
						);`);
		
		await multipleInsert(db, "Categories", categories);

		await multipleInsert(db, "Products", products);
	}
}