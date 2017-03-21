import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import connect from "./connect";

@odata.type(Product)
export class ProductsController extends ODataController{
    @odata.GET
    @odata.parameter("query", odata.query)
    async find(query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Products")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
        if (mongodbQuery.inlinecount){
            result.inlinecount = await db.collection("Products")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    @odata.parameter("key", odata.key)
    @odata.parameter("query", odata.query)
    async findOne(key, query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").findOne({ _id: key }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getCategory(result, query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        try{ result.CategoryId = new ObjectID(result.CategoryId); }catch(err){}
        return await db.collection("Categories").findOne({ _id: result.CategoryId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    @odata.PATCH("Category").$ref
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async setCategory(key, link) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        try{ link = new ObjectID(link); }catch(err){}
        return await db.collection("Products").updateOne({
            _id: key
        }, {
            $set: { CategoryId: link }
        }).then((result) => {
            return result.modifiedCount;
        });
    }

    @odata.DELETE("Category").$ref
    @odata.parameter("key", odata.key)
    async unsetCategory(key) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").updateOne({
            _id: key
        }, {
            $unset: { CategoryId: 1 }
        }).then((result) => {
            return result.modifiedCount;
        });
    }

    @odata.POST
    @odata.parameter("data", odata.body)
    async insert(data) {
        const db = await connect();
        try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
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
        const db = await connect();
        try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").updateOne({ _id: key }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    @odata.parameter("key", odata.key)
    @odata.parameter("delta", odata.body)
    async update(key, delta) {
        const db = await connect();
        try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").updateOne({ _id: key }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    @odata.parameter("key", odata.key)
    async remove(key) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").deleteOne({ _id: key }).then(result => result.deletedCount);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest() {
        const db = await connect();
        return (await db.collection("Products").find().sort({UnitPrice: 1}).limit(1).toArray())[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    @odata.parameter("min", Edm.Decimal, "max", Edm.Decimal)
    async getInPriceRange(min, max) {
        const db = await connect();
        return await db.collection("Products").find({UnitPrice: {$gte: 5, $lte: 8}}).toArray();
    }

    @Edm.Action
    @odata.parameter("a", Edm.String, "b", Edm.String)
    async swapPrice(a, b) {
        const db = await connect();
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
        const db = await connect();
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
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Categories")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
        if (mongodbQuery.inlinecount){
            result.inlinecount = await db.collection("Categories")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    @odata.parameter("key", odata.key)
    @odata.parameter("query", odata.query)
    async findOne(key, query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Categories").findOne({ _id: key }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getProducts(result, query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        let products = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Products")
            .find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] })
            .project(mongodbQuery.projection)
            .skip(mongodbQuery.skip || 0)
            .limit(mongodbQuery.limit || 0)
            .sort(mongodbQuery.sort)
            .toArray();
        if (mongodbQuery.inlinecount){
            products.inlinecount = await db.collection("Products")
                    .find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] })
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return products;
    }

    @odata.GET("Products")
    @odata.parameter("key", odata.key)
    @odata.parameter("result", odata.result)
    @odata.parameter("query", odata.query)
    async getProduct(key, result, query) {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Products").findOne({
                $and: [{ _id: key, CategoryId: result._id }, mongodbQuery.query]
            }, {
                fields: mongodbQuery.projection
            });
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    @odata.PATCH("Products").$ref
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async setCategory(key, link) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        try{ link = new ObjectID(link); }catch(err){}
        return await db.collection("Products").updateOne({
            _id: link
        }, {
            $set: { CategoryId: key }
        }).then((result) => {
            return result.modifiedCount;
        });
    }

    @odata.DELETE("Products").$ref
    @odata.parameter("key", odata.key)
    @odata.parameter("link", odata.link)
    async unsetCategory(key, link) {
        const db = await connect();
        try{ link = new ObjectID(link); }catch(err){}
        return await db.collection("Products").updateOne({
            _id: link
        }, {
            $unset: { CategoryId: 1 }
        }).then((result) => {
            return result.modifiedCount;
        });
    }

    @odata.POST
    @odata.parameter("data", odata.body)
    async insert(data) {
        const db = await connect();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    @odata.parameter("key", odata.key)
    @odata.parameter("data", odata.body)
    async upsert(key, data) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Categories").updateOne({ _id: key }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    @odata.parameter("key", odata.key)
    @odata.parameter("delta", odata.body)
    async update(key, delta) {
        const db = await connect();
        try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Categories").updateOne({ _id: key }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    @odata.parameter("key", odata.key)
    async remove(key) {
        const db = await connect();
        try{ key = new ObjectID(key); }catch(err){}
        return await db.collection("Categories").deleteOne({ _id: key }).then(result => result.deletedCount);
    }
}