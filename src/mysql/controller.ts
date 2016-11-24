import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mysqlConnection from "./connection";
import { promisifyWithDdName, getDeltaObjectInSQL, mapDiscontinued } from "./utils";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`);
        return mapDiscontinued(results);
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return mapDiscontinued(results)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const connection = await mysqlConnection();
        const sqlQuery = createQuery(query);
        return await new Promise<Category>((resolve, reject) =>
            connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = await mysqlConnection();
        return await new Promise<number>((resolve, reject) =>
            connection.query(`UPDATE Categories SET CategoryId = ${link} WHERE Id = ? `, [key], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        const connection = await mysqlConnection();
        return await new Promise<number>((resolve, reject) =>
            connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [key], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.Id || null, data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null]);
        return Object.assign({}, data, { Id: result.insertId });
    }

    /*@odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").updateOne({ id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data.id = result.upsertedId
            return data;
        });
    }*/

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`UPDATE Products SET ${getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key]);
        console.log("!!!!!!!!!!! update !!!!!!!!!!!!");
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
    async getCheapest(): Promise<Product> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`SELECT * FROM Products WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)`);
        console.log("!!!!!!!!!!! getCheapest !!!!!!!!!!!!");
        console.log(results);
        return results;
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`SELECT * FROM Products WHERE UnitPrice BETWEEN ? AND ?`, [min, max]);
        console.log("!!!!!!!!!!! getInPriceRange !!!!!!!!!!!!");
        console.log(results);
        return results;
    }

    @Edm.Action
    async swapPrice( @Edm.String key1: string, @Edm.String key2: string) {
        const connection = promisifyWithDdName(await mysqlConnection());
        const product1 = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key1]);
        const product2 = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key2]);
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product1.UnitPrice, key2]);
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product2.UnitPrice, key1]);
        console.log("!!!!!!!!!!! product1 !!!!!!!!!!!!");
        console.log(product1);
        console.log("!!!!!!!!!!! product2 !!!!!!!!!!!!");
        console.log(product2);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const product = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [productId]);
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [discountedPrice, productId]);
        console.log("!!!!!!!!!!! discountProduct !!!!!!!!!!!!");
        console.log(product);
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE ${sqlQuery.where}`);
        console.log("%%%%%%%%%% find %%%%%%%%%%");
        console.log(results);
        return results
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Category> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return results[0];
    }

    /*@odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").find(
            { $and: [{ CategoryId: result._id }, mongodbQuery.query] },
            mongodbQuery.projection,
            mongodbQuery.skip,
            mongodbQuery.limit
        ).toArray();
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: string, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").findOne({
            $and: [{ _id: new ObjectID(key), CategoryId: result._id }, mongodbQuery.query]
        }, {
                fields: mongodbQuery.projection
            });
    }*/

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = promisifyWithDdName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ? `, [key, link]))[0];
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = promisifyWithDdName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [link]))[0];
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [data.Id || null, data.Description || null, data.Name || null]);
        const res = Object.assign({}, data, { Id: result.insertId });
        console.log("+++++++++ insert result +++++++++");
        console.log(result);
        console.log("+++++++++ insert res +++++++++");
        console.log(res);
        return res;
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const results = await connection.query(`INSERT INTO Categories (Id,Description,Name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Description=?,Name=?`, [key, data.Description, data.Name, data.Description, data.Name]);
        console.log("!!!!!!!!!!! upsert !!!!!!!!!!!!");
        console.log(results);
        return results;
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
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
        /*let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);*/
        const connection = promisifyWithDdName(await mysqlConnection());
        return await connection.query(`DELETE FROM Categories WHERE Id = ?`, [key]);
    }
}