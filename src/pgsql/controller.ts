import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
import { Product, Category } from "./model";
import connect from "./connect";

@odata.type(Product)
export class ProductsController extends ODataController {
	
	@odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const db = await connect();
        const sqlQuery = createQuery(query);
        const result = await db.query(sqlQuery.from("Products"), sqlQuery.parameters);
		return result.rows;
    }
}