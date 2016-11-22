import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mysqlConnection from "./connection";

@odata.type(Product)
export class ProductsController extends ODataController {
    /*@odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const sqlQuery = createQuery(query);
        const connection = await mysqlConnection();
        return connection.query(sqlQuery.from("product"), sqlQuery.parameters).stream({
            highWaterMark: 5
        }).pipe(stream);
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const connection = await mysqlConnection();
        const sqlQuery = createQuery(query);
        return new Promise<Product>((resolve, reject) => {
            connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE _id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters], (err, result) => {
                if (err) return reject(err);
                return resolve(result[0]);
            });
        });
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const connection = await mysqlConnection();
        const sqlQuery = createQuery(query);
        return new Promise<Category>((resolve, reject) => {
            connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE _id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) => {
                if (err) return reject(err);
                return resolve(result[0]);
            });
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const connection = await mysqlConnection();
        return new Promise<number>((resolve, reject) => {
            connection.query(`UPDATE Categories SET CategoryId = link WHERE _id = ? `, key, (err, result) => {
                if (err) return reject(err);
                return resolve(result[0]);
            });
        });
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            _id: new ObjectID(key)
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = await mysqlConnection();
        return new Promise<Product>((resolve, reject) => {
            connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE _id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) => {
                if (err) return reject(err);
                return resolve(result[0]);
            });
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").updateOne({ _id: new ObjectID(key) }, data, {
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
        return await db.collection("Products").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        let db = await mongodb();
        return await db.collection("Products").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
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