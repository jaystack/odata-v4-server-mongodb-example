import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mongodb from "./connection";

@odata.type(Product)
export class ProductsController extends ODataController{
    @odata.GET
    @odata.parameter("query", odata.query)
    async find(query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return await db.collection("Products").find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).toArray();
    }

    @odata.GET
    @odata.parameter("key", odata.key)
    @odata.parameter("query", odata.query)
    async findOne(key, query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Products").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getCategory(result, query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Categories").findOne({ _id: new ObjectID(result.CategoryId) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async setCategory(key, link) {
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
    @odata.parameter("key", odata.key)
    async unsetCategory(key) {
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
    @odata.parameter("data", odata.body)
    async insert(data) {
        let db = await mongodb();
        if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
        return await db.collection("Products").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    @odata.parameter("key", odata.key)
    @odata.parameter("data", odata.body)
    @odata.parameter("context", odata.context)
    async upsert(key, data, context) {
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
    @odata.parameter("key", odata.key)
    @odata.parameter("delta", odata.body)
    async update(key, delta) {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Products").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    @odata.parameter("key", odata.key)
    async remove(key) {
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
    @odata.parameter("min", Edm.Decimal, "max", Edm.Decimal)
    async getInPriceRange(min, max) {
        let db = await mongodb();
        return await db.collection("Products").find({UnitPrice: {$gte: 5, $lte: 8}}).toArray();
    }

    @Edm.Action
    @odata.parameter("a", Edm.String, "b", Edm.String)
    async swapPrice(a, b) {
        let db = await mongodb();
        const products = await db.collection("Products").find({_id: {$in: [new ObjectID(a), new ObjectID(b)]}}, {UnitPrice: 1}).toArray();
        const aProduct = products.find(product => product._id.toHexString() === a);
        const bProduct = products.find(product => product._id.toHexString() === b);
        await db.collection("Products").update({_id: new ObjectID(a)}, {$set: {UnitPrice: bProduct.UnitPrice}});
        await db.collection("Products").update({_id: new ObjectID(b)}, {$set: {UnitPrice: aProduct.UnitPrice}});
    }

    @Edm.Action
    @odata.parameter("productId", Edm.String)
    @odata.parameter("percent", Edm.Int32)
    async discountProduct(productId, percent) {
        let db = await mongodb();
        const product = await db.collection("Products").findOne({ _id: new ObjectID(productId) });
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await db.collection("Products").update({ _id: new ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController{
    @odata.GET
    @odata.parameter("query", odata.query)
    async find(query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        return await db.collection("Categories").find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).toArray();
    }

    @odata.GET
    @odata.parameter("key", odata.key)
    @odata.parameter("query", odata.query)
    async findOne(key, query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        return await db.collection("Categories").findOne({ _id: new ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getProducts(result, query) {
        let db = await mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return await db.collection("Products").find(
                { $and: [{ CategoryId: result._id }, mongodbQuery.query] },
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).toArray();
    }

    @odata.GET("Products")
    @odata.parameter("key", odata.key)
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getProduct(key, result, query) {
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
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async setCategory(key, link) {
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
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async unsetCategory(key, link) {
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
    @odata.parameter("data", odata.body)
    async insert(data) {
        let db = await mongodb();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    @odata.parameter("key", odata.key)
    @odata.parameter("data", odata.body)
    async upsert(key, data) {
        let db = await mongodb();
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data;
        });
    }

    @odata.PATCH
    @odata.parameter("key", odata.key)
    @odata.parameter("delta", odata.body)
    async update(key, delta) {
        let db = await mongodb();
        if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
        return await db.collection("Categories").updateOne({ _id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    @odata.parameter("key", odata.key)
    async remove(key) {
        let db = await mongodb();
        return await db.collection("Categories").deleteOne({ _id: new ObjectID(key) }).then(result => result.deletedCount);
    }
}