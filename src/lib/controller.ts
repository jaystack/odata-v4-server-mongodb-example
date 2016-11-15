import { MongoClient, Collection, Db, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";

export const mongodb = async function():Promise<Db>{
    return await MongoClient.connect("mongodb://localhost:27017/odata-v4-server-mongodb-example");
};

@odata.type(Product)
export class ProductsController extends ODataController{
    @odata.GET
    async find(@odata.query query:ODataQuery):Promise<Product[]>{
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).toArray();
    }

    @odata.GET
    async findOne(@odata.key key:string, @odata.query query:ODataQuery):Promise<Product>{
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return db.collection("Products").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    async getCategory(@odata.result result:Product, @odata.query query:ODataQuery):Promise<Category>{
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return db.collection("Categories").findOne({ _id: new ObjectID(result.CategoryId) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory(@odata.key key:string, @odata.link link:string):Promise<number>{
        let db = await mongodb();
        return await db.collection("Products").updateOne({
            _id: new ObjectID(key)
        }, {
            $set: { CategoryId: new ObjectID(link) }
        }).then((result) => {
            return result.modifiedCount;
        });
    }

    @odata.DELETE("Category").$ref
    async unsetCategory(@odata.key key:string):Promise<number>{
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
    async insert(@odata.body data:any):Promise<Product>{
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key:string, @odata.body data:any, @odata.context context:any):Promise<Product>{
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
    async update(@odata.key key:string, @odata.body delta:any):Promise<number>{
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Products").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key:string):Promise<number>{
        let db = await mongodb();
        return await db.collection("Products").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController{
    @odata.GET
    async find(@odata.query query:ODataQuery):Promise<Category[]>{
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
    async findOne(@odata.key key:string, @odata.query query:ODataQuery):Promise<Category>{
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return db.collection("Categories").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    async getProducts(@odata.result result:Category, @odata.query query:ODataQuery):Promise<Product[]>{
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
    async getProduct(@odata.key key:string, @odata.result result:Category, @odata.query query:ODataQuery):Promise<Product>{
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
    async setCategory(@odata.key key:string, @odata.link link:string):Promise<number>{
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
    async unsetCategory(@odata.key key:string, @odata.link link:string):Promise<number>{
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
    async insert(@odata.body data:any):Promise<Category>{
        let db = await mongodb();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key:string, @odata.body data:any):Promise<Category>{
        let db = await mongodb();
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data;
        });
    }

    @odata.PATCH
    async update(@odata.key key:string, @odata.body delta:any):Promise<number>{
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key:string):Promise<number>{
        let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }
}