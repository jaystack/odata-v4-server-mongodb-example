import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mongodb from "./connection";

@odata.type(Product)
export class ProductsController extends ODataController{
    @odata.GET
    async find(@odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return await db.collection("Products").find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).sort(mongodbQuery.sort).toArray();
    }

    @odata.GET
    async findOne(@odata.key key, @odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Products").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    async getCategory(@odata.result result, @odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Categories").findOne({ _id: new ObjectID(result.CategoryId) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory(@odata.key key, @odata.link link) {
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
    async unsetCategory(@odata.key key) {
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
    async insert(@odata.body data) {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key, @odata.body data, @odata.context context) {
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
    async update(@odata.key key, @odata.body delta) {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Products").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key) {
        let db = await mongodb();
        return await db.collection("Products").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest() {
        let db = await mongodb();
        return (await db.collection("Products").find().sort({UnitPrice: 1}).limit(1).toArray())[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange(@Edm.Decimal min, @Edm.Decimal max) {
        let db = await mongodb();
        return await db.collection("Products").find({UnitPrice: {$gte: 5, $lte: 8}}).toArray();
    }

    @Edm.Action
    async swapPrice(@Edm.String a, @Edm.String b) {
        let db = await mongodb();
        const products = await db.collection("Products").find({_id: {$in: [new ObjectID(a), new ObjectID(b)]}}, {UnitPrice: 1}).toArray();
        const aProduct = products.find(product => product._id.toHexString() === a);
        const bProduct = products.find(product => product._id.toHexString() === b);
        await db.collection("Products").update({_id: new ObjectID(a)}, {$set: {UnitPrice: bProduct.UnitPrice}});
        await db.collection("Products").update({_id: new ObjectID(b)}, {$set: {UnitPrice: aProduct.UnitPrice}});
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController{
    @odata.GET
    async find(@odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        return await db.collection("Categories").find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).sort(mongodbQuery.sort).toArray();
    }

    @odata.GET
    async findOne(@odata.key key, @odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Categories").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    async getProducts(@odata.result result, @odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return await db.collection("Products").find(
                { $and: [{ CategoryId: result._id }, mongodbQuery.query] },
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).sort(mongodbQuery.sort).toArray();
    }

    @odata.GET("Products")
    async getProduct(@odata.key key, @odata.result result, @odata.query query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return await db.collection("Products").findOne({
                $and: [{ _id: new ObjectID(key), CategoryId: result._id }, mongodbQuery.query]
            }, {
                fields: mongodbQuery.projection
            });
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory(@odata.key key, @odata.link link) {
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
    async unsetCategory(@odata.key key, @odata.link link) {
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
    async insert(@odata.body data) {
        let db = await mongodb();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key, @odata.body data) {
        let db = await mongodb();
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data;
        });
    }

    @odata.PATCH
    async update(@odata.key key, @odata.body delta) {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key) {
        let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }
}