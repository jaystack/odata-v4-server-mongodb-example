//import { Collection, ObjectID } from "mongodb";
import * as mssql from "mssql";
import { createQuery } from "odata-v4-mssql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mssqlConnection from "./connection";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        const sqlQuery = createQuery(query);
        // console.log("\n\n\n================= sqlQuery:\n" + JSON.stringify(sqlQuery, null, 2));
        // console.log("\n\n===> " + `SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`);
        return await new Promise<Product[]>((resolve, reject) =>
            request.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`/*, [...sqlQuery.parameters]*/, (err, results) => {
                return (err) ? reject(err) : resolve(results);
            }));
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        const sqlQuery = createQuery(query);
        console.log("\n\n===> " + `SELECT ${sqlQuery.select} FROM Products WHERE Id = ${key} AND (${sqlQuery.where})`);
        return await new Promise<Product>((resolve, reject) =>
            //request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters], (err, result) =>
            request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ${key} AND (${sqlQuery.where})`, (err, result) => {
                console.log("\n\n\n================= result:\n" + JSON.stringify(result, null, 2));
                return (err) ? reject(err) : resolve(result[0]);
            }));
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        const sqlQuery = createQuery(query);
        return await new Promise<Category>((resolve, reject) =>
            //request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) =>
            request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = '${result.CategoryId}' AND (${sqlQuery.where})`, (err, result) => {
                return (err) ? reject(err) : resolve(result[0]);
            }));
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        return await new Promise<number>((resolve, reject) =>
            //request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ? `, [key], (err, result) =>
            request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ${key}`, (err, result) => {
                //connection.close();
                return (err) ? reject(err) : resolve(result[0]);
            }));
    }

    /*@odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            Id: new ObjectID(key)
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }*/

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = await mssqlConnection();
        const request1 = new mssql.Request(connection);
        await new Promise<any>((resolve, reject) => request1.query(`USE northwind_mssql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        return await new Promise<Product>((resolve, reject) => {
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(data);
            console.log([data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null]);
            const request2 = new mssql.Request(connection);
            //request2.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null], (err, result) =>
            request2.query(`INSERT INTO Products VALUES (${(data.QuantityPerUnit || null)}, ${(data.UnitPrice || null)}, ${(data.CategoryId || null)}, ${(data.Name || null)}, ${(data.Discontinued || null)}, ${(data.Id || null)});`, (err, result) => {
                //connection.close();
                return (err) ? reject(err) : resolve(result[0]);
            });
        });
    }

    /*@odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data.Id = result.upsertedId
            return data;
        });
    }*/

    getDeltaObjectInSQL(delta: any): string {
        const deltaKeys = Object.keys(delta);
        if (deltaKeys.length == 1) return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
        return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        /*let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);*/
        console.log("++++++++++++++++++");
        console.log(delta);
        console.log(key);
        const connection = await mssqlConnection();
        const request = new mssql.Request(connection);
        return await new Promise<number>((resolve, reject) =>
            //request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key], (err, result) =>
            request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ${key}`, (err, result) => {
                //connection.close();
                return (err) ? reject(err) : resolve(result[0]);
            }));
    }

    /*@odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").deleteOne({ Id: new ObjectID(key) }).then(result => result.deletedCount);
    }
    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<Product> {
        let db = await mongodb();
        return (await db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
    }
    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        let db = await mongodb();
        return await db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
    }
    @Edm.Action
    async swapPrice( @Edm.String a: string, @Edm.String b: string) {
        let db = await mongodb();
        const products = await db.collection("Products").find({ Id: { $in: [new ObjectID(a), new ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
        const aProduct = products.find(product => product.Id.toHexString() === a);
        const bProduct = products.find(product => product.Id.toHexString() === b);
        await db.collection("Products").update({ Id: new ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
        await db.collection("Products").update({ Id: new ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
    }
    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        let db = await mongodb();
        const product = await db.collection("Products").findOne({ Id: new ObjectID(productId) });
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await db.collection("Products").update({ Id: new ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
    }*/
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    /*@odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query.Id == "string") mongodbQuery.query.Id = new ObjectID(mongodbQuery.query.Id);
        return db.collection("Categories").find(
            mongodbQuery.query,
            mongodbQuery.projection,
            mongodbQuery.skip,
            mongodbQuery.limit
        ).toArray();
    }
    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Category> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return db.collection("Categories").findOne({ Id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }
    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query.Id == "string") mongodbQuery.query.Id = new ObjectID(mongodbQuery.query.Id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").find(
            { $and: [{ CategoryId: result.Id }, mongodbQuery.query] },
            mongodbQuery.projection,
            mongodbQuery.skip,
            mongodbQuery.limit
        ).toArray();
    }
    @odata.GET("Products")
    async getProduct( @odata.key key: string, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query.Id == "string") mongodbQuery.query.Id = new ObjectID(mongodbQuery.query.Id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").findOne({
            $and: [{ Id: new ObjectID(key), CategoryId: result.Id }, mongodbQuery.query]
        }, {
                fields: mongodbQuery.projection
            });
    }
    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            Id: new ObjectID(link)
        }, {
                $set: { CategoryId: new ObjectID(key) }
            }).then((result) => {
                return result.modifiedCount;
            });
    }
    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            Id: new ObjectID(link)
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }
    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        let db = await mongodb();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data.Id = result.insertedId;
            return data;
        });
    }
    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        let db = await mongodb();
        return await db.collection("Categories").updateOne({ Id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data.Id = result.upsertedId
            return data;
        });
    }
    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ Id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }
    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Categories").deleteOne({ Id: new ObjectID(key) }).then(result => result.deletedCount);
    }*/
}