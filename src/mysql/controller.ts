import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mysql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import mysqlConnection from "./connection";
import { promisifyWithDbName, getDeltaObjectInSQL, mapDiscontinued, filterNullValues, getPatchQueryParameters, getPatchQueryString } from "./utils";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
        return mapDiscontinued(results);
    }

    @odata.GET
    async findOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Product> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return mapDiscontinued(filterNullValues(results))[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        return (await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters]))[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ?`, [link, key]);
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: number): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [key]);
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.Id || null, data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null]);
        return Object.assign({}, data, { Id: result.insertId });
    }

    @odata.PUT
    async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Product> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`INSERT INTO Products (Id,QuantityPerUnit,UnitPrice,CategoryId,Name,Discontinued) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE QuantityPerUnit=?,UnitPrice=?,CategoryId=?,Name=?,Discontinued=?`, [key, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued]);
    }

    @odata.PATCH
    async update( @odata.key key: number, @odata.body delta: any): Promise<any> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(getPatchQueryString('Products', delta), getPatchQueryParameters(key, delta));
    }

    @odata.DELETE
    async remove( @odata.key key: number): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`DELETE FROM Products WHERE Id = ?`, [key]);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<any> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const results: Product[] = await connection.query(`SELECT * FROM Products WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)`);
        return mapDiscontinued(results)[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const results = await connection.query(`SELECT * FROM Products WHERE UnitPrice BETWEEN ? AND ?`, [min, max]);
        return mapDiscontinued(results);
    }

    @Edm.Action
    async swapPrice( @Edm.String key1: number, @Edm.String key2: number) {
        const connection = promisifyWithDbName(await mysqlConnection());
        const product1 = (await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key1]))[0];
        const product2 = (await connection.query(`SELECT * FROM Products WHERE Id = ?`, [key2]))[0];
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product1.UnitPrice, key2]);
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [product2.UnitPrice, key1]);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: number, @Edm.Int32 percent: number): Promise<void> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const product = await connection.query(`SELECT * FROM Products WHERE Id = ?`, [productId]);
        const discountedPrice = ((100 - percent) / 100) * product[0].UnitPrice;
        await connection.query(`UPDATE Products SET UnitPrice = ? WHERE Id = ?`, [discountedPrice, productId]);
    }
}

@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        return await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE ${sqlQuery.where}`, [...sqlQuery.parameters]);
    }

    @odata.GET
    async findOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Category> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [key, ...sqlQuery.parameters]);
        return filterNullValues(results)[0];
    }

    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        const results = await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE CategoryId = ? AND (${sqlQuery.where})`, [result.Id, ...sqlQuery.parameters]);
        return mapDiscontinued(results);
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: number, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const sqlQuery = createQuery(query);
        return (await connection.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = ? AND (CategoryId = ?,${sqlQuery.where})`, [key, result.Id, ...sqlQuery.parameters]))[0];
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = ? WHERE Id = ? `, [key, link]))[0];
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: number, @odata.link link: string): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return (await connection.query(`UPDATE Products SET CategoryId = NULL WHERE Id = ?`, [link]))[0];
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        const connection = promisifyWithDbName(await mysqlConnection());
        const result = await connection.query(`INSERT INTO Categories VALUES (?,?,?);`, [data.Id || null, data.Description || null, data.Name || null]);
        const res = Object.assign({}, data, { Id: result.insertId });
        return res;
    }

    @odata.PUT
    async upsert( @odata.key key: number, @odata.body data: any): Promise<Category> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`INSERT INTO Categories (Id,Description,Name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Description=?,Name=?`, [key, data.Description, data.Name, data.Description, data.Name]);
    }

    @odata.PATCH
    async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(getPatchQueryString('Categories', delta), getPatchQueryParameters(key, delta));
    }

    @odata.DELETE
    async remove( @odata.key key: number): Promise<number> {
        const connection = promisifyWithDbName(await mysqlConnection());
        return await connection.query(`DELETE FROM Categories WHERE Id = ?`, [key]);
    }
}