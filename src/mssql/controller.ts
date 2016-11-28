import * as mssql from "mssql";
import { createQuery } from "odata-v4-mssql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mssqlConnection from "./connection";
import convertResults from "./utils/convertResults";

@odata.type(Product)
export class ProductsController extends ODataController {

    @odata.GET
    async find( @odata.stream stream, @odata.query query: ODataQuery): Promise<Product[]|void> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let output = request.pipe(stream);
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        sqlQuery.orderby = "Id";
        request.query(sqlQuery.from("Products"));
        //request.query(`SELECT UnitPrice FROM "Products" WHERE "Id" = 30`);
        return <Product[]|void>convertResults(output);
    }
/*
    @odata.GET
    async find( @odata.stream stream, @odata.query query: ODataQuery): Promise<Product[]|void> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        sqlQuery.orderby = "Id";
        request.query(sqlQuery.from("Products"));
        //request.query(`SELECT UnitPrice FROM "Products" WHERE "Id" = 30`);
        return <Product[]|void>convertResults(output);
    }
*/
    @odata.GET
    async findOne( @odata.key id: string, @odata.stream stream, @odata.query query: ODataQuery): Promise<Product> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        request.input("Id", id);
        const result = await <Promise<Product[]>>request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = @id AND (${sqlQuery.where})`);
        return <Product>convertResults(result)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result product: Product, @odata.query query: ODataQuery ): Promise<Category> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        const sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        request.input("Id", product.CategoryId);
        const result = await <Promise<Category[]>>request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = @id AND (${sqlQuery.where})`);
        return <Category>convertResults(result)[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key id: number, @odata.link link: number ): Promise<number> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        request.input("Id", id);
        request.input("Link", link);
        const result = await <Promise<Product[]>>request.query(`UPDATE Products SET CategoryId = @Link WHERE Id = @Id`); // TODO: 0 / 1 -et kell visszaadni
        return <any>result; //.length;
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key id: number ): Promise<number> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        request.input("Id", id);
        const result = await request.query(`UPDATE Products SET CategoryId = NULL WHERE Id = @Id`); // TODO: 0 / 1 -et kell visszaadni
        return <any>result; //rowCount;
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let columns: string[] = [];
        let values: any[] = [];
        Object.keys(data).forEach((key: string) => {
            columns.push(key);
            values.push(addQuote(data[key]));
        });
        let sqlCommand = `INSERT INTO Products (${columns.join(", ")}) OUTPUT inserted.* VALUES (${values.join(", ")});`;
        //console.log("\n\n\n======================= Products POST sqlCommand:\n" + sqlCommand,"\n");
        const result = await request.query(sqlCommand);
        //console.log("\n\n\n===> result:", JSON.stringify(result, null, 2));
        return <Product>convertResults(result)[0]; //convertResults(rows)[0];
    }

    @odata.PUT // replace the content of the row
    async upsert( @odata.key id: string, @odata.body data: any, @odata.context context: any ): Promise<Product> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlCommandDelete = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
        //console.log("\n\n\n======================= Products PUT sqlCommandDelete:\n" + sqlCommandDelete,"\n");
        const dataDeleted = await request.query(sqlCommandDelete);
        //console.log("\n\n===> dataDeleted:", JSON.stringify(dataDeleted, null, 2));

        // This will save the original properties:
        // const dataToInsert = Object.assign({}, dataDeleted[0], data, { Id: id });
        // This will satisfy the requirements of the unit tests:
        const dataToInsert = Object.assign({}, data, { Id: id });
        //console.log("\n\n===> dataToInsert:", JSON.stringify(dataToInsert, null, 2));
        let columns: string[] = [];
        let insertedColumns: string[] = [];
        let values: any[] = [];
        Object.keys(dataToInsert).forEach((key: string) => {
            columns.push(key);
            insertedColumns.push("inserted." + key);
            values.push(addQuote(dataToInsert[key]));
        });
        let sqlCommand = `SET IDENTITY_INSERT Products ON;
        INSERT INTO Products (${columns.join(", ")}) OUTPUT ${insertedColumns.join(", ")} VALUES (${values.join(", ")});
        SET IDENTITY_INSERT Products OFF;`;
        console.log("\n\n\n======================= Products PUT sqlCommand:\n" + sqlCommand,"\n");
        const result = await request.query(sqlCommand);
        return <Product>convertResults(result)[0]; //convertResults(rows)[0];
    }

    @odata.PATCH // update the content of the row (delta)
    async update( @odata.key id: string, @odata.body delta: any ): Promise<number> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sets: any[] = [];
        Object.keys(delta).forEach((key: string) => {
            sets.push(key + "=" + addQuote(delta[key]));
        });
        let sqlCommand = `DECLARE @impactedId INT;
        UPDATE Products SET ${sets.join(", ")}, @impactedId = Id WHERE Id = ${id};
        SELECT @impactedId as 'ImpactedId';`;
        const result = await <Promise<any>>request.query(sqlCommand);
        return (result) ? 1 : 0; //<Product>result[0];
    }

    @odata.DELETE
    async remove( @odata.key id: string ): Promise<number> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlCommand = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
        const result = await <Promise<Product[]>>request.query(sqlCommand);
        return (Array.isArray(result)) ? result.length : 0; //<Product>result[0];
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(@odata.result result:Product): Promise<Product> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlCommand = "SELECT TOP(1) * FROM Products ORDER BY UnitPrice ASC";
        console.log("\n\n===> Product/Northwind.getCheapest sqlCommand:", sqlCommand);
        const results = await <Promise<Product[]>>request.query(sqlCommand);
        result = convertResults(results)[0];
        console.log("%%%%%", result);
        return result;
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number, @odata.result result:Product[]): Promise<Product[]> {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        let sqlCommand = `SELECT * FROM Products WHERE UnitPrice >= ${min} AND UnitPrice <= ${max} ORDER BY UnitPrice`;
        const results = await <Promise<Product[]>>request.query(sqlCommand);
        result = <Product[]>convertResults(results);
        console.log("===> getInPriceRange:", result);
        console.log(sqlCommand);
        return result;
    }

    @Edm.Action
    async swapPrice( @Edm.String a: number, @Edm.String b: number) {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        const result = await <Promise<Product[]>>request.query(`SELECT Id, UnitPrice FROM Products WHERE Id IN (${a}, ${b})`);
        const aProduct = result.find(product => product.Id === a);
        const bProduct = result.find(product => product.Id === b);
        await request.query(`UPDATE Products SET UnitPrice = ${bProduct.UnitPrice} WHERE Id = ${aProduct.Id}`);
        await request.query(`UPDATE Products SET UnitPrice = ${aProduct.UnitPrice} WHERE Id = ${bProduct.Id}`);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: number, @Edm.Int32 percent: number) {
        const connection = await mssqlConnection();
        let request = new mssql.Request(connection);
        await request.query(`UPDATE Products SET UnitPrice = ${((100 - percent) / 100)} * UnitPrice WHERE Id = ${productId}`);
    }
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

function addQuote(par: any): string {
    if (par === true || par === "true") { return '1'; }
    if (par === false || par === "false") { return '0'; }
    if (typeof par === "string") { return "'" + par + "'"; }
    return String(par);
}