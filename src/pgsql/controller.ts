import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
import { Product, Category } from "./model";
import connect from "./connect";

@odata.type(Product)
export class ProductsController extends ODataController {
	
	@odata.GET
    async select( @odata.query query: ODataQuery ): Promise<Product[]> {
        const db = await connect();
        const sqlQuery = createQuery(query);
        const result = await db.query(sqlQuery.from('"Products"'), sqlQuery.parameters);
		return result.rows;
    }

    @odata.GET
    async selectOne( @odata.key key: string, @odata.query query: ODataQuery ): Promise<Product> {
        const db = await connect();
        const sqlQuery = createQuery(query);
        const result = await db.query(`SELECT ${sqlQuery.select} FROM "Products"
                                        WHERE "Id" = $${sqlQuery.parameters.length + 1} AND (${sqlQuery.where})`,
                                        [... sqlQuery.parameters, key]
                                    );
        return result.rows[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result product: Product, @odata.query query: ODataQuery ): Promise<Category> {
        const db = await connect();
        const sqlQuery = createQuery(query);
        const result = await db.query(sqlQuery.from('"Categories"'), sqlQuery.parameters);
        return result.rows[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: number ): Promise<number> {
        
    }
}