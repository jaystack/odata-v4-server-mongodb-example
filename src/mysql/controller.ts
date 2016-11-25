import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mysqlConnection from "./connection";
import { promisifyWithDdName, getDeltaObjectInSQL, mapDiscontinued, getUpsertQueryString, getUpsertQueryParameters } from "./utils";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        console.log("!!!!!!!!!!! find !!!!!!!!!!!!");
        console.log(query);
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
        return mapDiscontinued(results);
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        console.log("!!!!!!!!!!! findOne !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return mapDiscontinued(results)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        console.log("!!!!!!!!!!! getCategory !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        return (await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters]))[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        console.log("!!!!!!!!!!! setCategory !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        return await connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ?`, [link, key]);
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        console.log("!!!!!!!!!!! unsetCategory !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [key]);
        console.log("++++++ res madafaka +++++");
        console.log(results);
        return results;
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        console.log("!!!!!!!!!!! insert !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.Id || null, data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null]);
        return Object.assign({}, data, { Id: result.insertId });
    }

    @odata.PUT
    async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Product> {
        console.log("!!!!!!!!!!! upsert !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        //return await connection.query(getUpsertQueryString(key, data), getUpsertQueryParameters(key, data));
        return await connection.query(`INSERT INTO Products (Id,QuantityPerUnit,UnitPrice,CategoryId,Name,Discontinued) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE QuantityPerUnit=?,UnitPrice=?,CategoryId=?,Name=?,Discontinued=?`, [key, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued]);
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        console.log("!!!!!!!!!!! update !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`UPDATE Products SET ${getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key]);
        console.log(results);
        return results;
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const connection = promisifyWithDdName(await mysqlConnection());
        return await connection.query(`DELETE FROM Products WHERE Id = ?`, [key]);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<any> {
        console.log("!!!!!!!!!!! getCheapest !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const results: Product[] = await connection.query(`SELECT * FROM Products WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)`);
        return mapDiscontinued(results)[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        console.log("!!!!!!!!!!! getInPriceRange !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`SELECT * FROM Products WHERE UnitPrice BETWEEN ? AND ?`, [min, max]);
        return mapDiscontinued(results);
    }

    @Edm.Action
    //async swapPrice( @Edm.Int32 key1: number, @Edm.Int32 key2: number) {
    async swapPrice( @Edm.String key1: string, @Edm.String key2: string) {
        console.log("!!!!!!!!!!! swap !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        console.log(key1);
        console.log(key2);
        const product1 = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key1]);
        const product2 = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key2]);
        console.log("!!!!! kecske !!!!!");
        console.log(product1);
        console.log(product2);
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product1.UnitPrice, key2]);
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product2.UnitPrice, key1]);
        console.log("!!!!!!!!!!! product1 !!!!!!!!!!!!");
        console.log(product1);
        console.log("!!!!!!!!!!! product2 !!!!!!!!!!!!");
        console.log(product2);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        console.log("!!!!!!!!!!! discountProduct !!!!!!!!!!!!");
        const connection = promisifyWithDdName(await mysqlConnection());
        const product = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [productId]);
        const discountedPrice = ((100 - percent) / 100) * product[0].UnitPrice;
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [discountedPrice, productId]);
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        console.log("%%%%%%%%%% find %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
        console.log(JSON.stringify(results, null, 2));
        console.log(sqlQuery.where);
        console.log(sqlQuery.parameters);
        return results
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Category> {
        console.log("%%%%%%%%%% findOne %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return results[0];
    }

    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        console.log("%%%%%%%%%% getProducts %%%%%%%%%%");
        /*let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").find(
            { $and: [{ CategoryId: result._id }, mongodbQuery.query] },
            mongodbQuery.projection,
            mongodbQuery.skip,
            mongodbQuery.limit
        ).toArray();*/
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE CategoryId = ? AND (${sqlQuery.where})`, [result.Id, ...sqlQuery.parameters]);
        return mapDiscontinued(results);
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: string, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        console.log("%%%%%%%%%% getProduct %%%%%%%%%%");
        /*let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").findOne({
            $and: [{ _id: new ObjectID(key), CategoryId: result._id }, mongodbQuery.query]
        }, {
                fields: mongodbQuery.projection
            });*/
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        return (await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (CategoryId = ?,${sqlQuery.where})`, [key, result.Id, ...sqlQuery.parameters]))[0];
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        console.log("%%%%%%%%%% setCategory %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ? `, [key, link]))[0];
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        console.log("%%%%%%%%%% unsetCategory %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [link]))[0];
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        console.log("%%%%%%%%%% insert %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [data.Id || null, data.Description || null, data.Name || null]);
        const res = Object.assign({}, data, { Id: result.insertId });
        return res;
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        console.log("%%%%%%%%%% upsert %%%%%%%%%%");
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`INSERT INTO Categories (Id,Description,Name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Description=?,Name=?`, [key, data.Description, data.Name, data.Description, data.Name]);
        console.log("!!!!!!!!!!! upsert !!!!!!!!!!!!");
        console.log(results);
        return results;
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        console.log("%%%%%%%%%% update %%%%%%%%%%");
        /*let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);*/
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`UPDATE Categories SET ${getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key]);
        console.log("!!!!!!!!!!! update !!!!!!!!!!!!");
        console.log(results);
        return results;
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        console.log("%%%%%%%%%% remove %%%%%%%%%%");
        /*let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);*/
        const connection = promisifyWithDdName(await mysqlConnection());
        return await connection.query(`DELETE FROM Categories WHERE Id = ?`, [key]);
    }
}