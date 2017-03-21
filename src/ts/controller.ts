import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import connect from "./connect";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
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
            (<any>result).inlinecount = await db.collection("Products")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection("Products").findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let catId;
        try{ catId = new ObjectID(result.CategoryId); }catch(err){ catId = result.CategoryId; }
        return db.collection("Categories").findOne({ _id: catId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    @odata.PATCH("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        let linkId;
        try{ linkId = new ObjectID(link); }catch(err){ linkId = link; }
        return await db.collection("Products").updateOne({
            _id: keyId
        }, {
                $set: { CategoryId: linkId }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Products").updateOne({
            _id: keyId
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const db = await connect();
        try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
        return await db.collection("Products").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        const db = await connect();
        try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
        if (data._id) delete data._id;
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Products").updateOne({ _id: keyId }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();
        try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        if (delta._id) delete delta._id;
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Products").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Products").deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<Product> {
        const db = await connect();
        return (await db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        const db = await connect();
        return await db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
    }

    @Edm.Action
    async swapPrice( @Edm.String a: string, @Edm.String b: string) {
        const db = await connect();
        const products = await db.collection("Products").find({ _id: { $in: [new ObjectID(a), new ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
        const aProduct = products.find(product => product._id.toHexString() === a);
        const bProduct = products.find(product => product._id.toHexString() === b);
        await db.collection("Products").update({ _id: new ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
        await db.collection("Products").update({ _id: new ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        const db = await connect();
        const product = await db.collection("Products").findOne({ _id: new ObjectID(productId) });
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await db.collection("Products").update({ _id: new ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
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
            (<any>result).inlinecount = await db.collection("Categories")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection("Categories").findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
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
            (<any>products).inlinecount = await db.collection("Products")
                    .find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] })
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return products;
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: string, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection("Products").findOne({
            $and: [{ _id: keyId, CategoryId: result._id }, mongodbQuery.query]
        }, {
                fields: mongodbQuery.projection
            });
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    @odata.PATCH("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        let linkId;
        try{ linkId = new ObjectID(link); }catch(err){ linkId = link; }
        return await db.collection("Products").updateOne({
            _id: linkId
        }, {
                $set: { CategoryId: keyId }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        let linkId;
        try{ linkId = new ObjectID(link); }catch(err){ linkId = link; }
        return await db.collection("Products").updateOne({
            _id: linkId
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        const db = await connect();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").updateOne({ _id: keyId }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();
        try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }
}