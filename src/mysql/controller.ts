import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mysqlConnection from "./connection";

function getDeltaObjectInSQL(delta: any): string {
    const deltaKeys = Object.keys(delta);
    if (deltaKeys.length == 1) return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
    return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}

function mapDiscontinued(results: any[]): any[] {
    return results.map(result => {
        result.Discontinued = (result.Discontinued == 1) ? true : false;
        return result;
    });
}

function promisifyWithDdName(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];

            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(`USE northwind_mysql_test_db`, (error, res) => {
                        if (error) return reject(error);
                        target.query(...args, (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        })
                    })
                });
            }
        }
    });
}

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const connection = await mysqlConnection();
        const sqlQuery = createQuery(query);
        return await new Promise<Product[]>((resolve, reject) =>
            connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`/*, [...sqlQuery.parameters]*/, (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const connection = promisifyWithDdName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return mapDiscontinued(results)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const connection = await mysqlConnection();
        const sqlQuery = createQuery(query);
        return await new Promise<Category>((resolve, reject) =>
            connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = await mysqlConnection();
        return await new Promise<number>((resolve, reject) =>
            connection.query(`UPDATE Categories SET CategoryId = ${link} WHERE id = ? `, [key], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        const connection = await mysqlConnection();
        return await new Promise<number>((resolve, reject) =>
            connection.query(`UPDATE Products SET CategoryId = NULL WHERE id = ?`, [key], (err, result) =>
                (err) ? reject(err) : resolve(result[0])));
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = await mysqlConnection();
        await new Promise<any>((resolve, reject) => connection.query(`USE northwind_mysql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
        return await new Promise<Product>((resolve, reject) => {
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(data);
            console.log([data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.id || null]);
            connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.id || null], (err, result) =>
                (err) ? reject(err) : resolve(result[0]))
        });
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
        console.log("++++++++++++++++++");
        console.log(delta);
        console.log(key);
        const connection = await mysqlConnection();
        return await new Promise<number>((resolve, reject) => {
            connection.query(`USE northwind_mysql_test_db`, (error, res) => {

                connection.query(`UPDATE Products SET ${getDeltaObjectInSQL(delta)} WHERE id = ? `, [key], (err, result) =>
                    (err) ? reject(err) : resolve(result[0]))

            })

        });
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const connection = promisifyWithDdName(await mysqlConnection());
        return await connection.query(`DELETE FROM Products WHERE id = ?`, [key]);
    }

    /*@Edm.Function
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
        const products = await db.collection("Products").find({ _id: { $in: [new ObjectID(a), new ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
        const aProduct = products.find(product => product._id.toHexString() === a);
        const bProduct = products.find(product => product._id.toHexString() === b);
        await db.collection("Products").update({ _id: new ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
        await db.collection("Products").update({ _id: new ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        let db = await mongodb();
        const product = await db.collection("Products").findOne({ _id: new ObjectID(productId) });
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await db.collection("Products").update({ _id: new ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
    }*/
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    /*@odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
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
        return db.collection("Categories").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
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
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            _id: new ObjectID(link)
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
            _id: new ObjectID(link)
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
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        let db = await mongodb();
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data;
        });
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }*/
}