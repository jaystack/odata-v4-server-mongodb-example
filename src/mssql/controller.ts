import * as mssql from "mssql";
import { createQuery } from "odata-v4-mssql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
import { mssqlRequest, default as mssqlConnection } from "./connection";
import convertResults from "./utils/convertResults";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.stream stream, @odata.query query: ODataQuery): Promise<Product[]|void> {
        let request = await mssqlRequest();
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        sqlQuery.orderby = "Id";
        return request.query(sqlQuery.from("Products"));
    }

    @odata.GET
    async findOne( @odata.key id: string, @odata.stream stream, @odata.query query: ODataQuery): Promise<Product> {
        let request = await mssqlRequest();
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        request.input("Id", id);
        const result = await <Promise<Product[]>>request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = @id AND (${sqlQuery.where})`);
        return convertResults(result)[0];
    }

    @odata.GET("Category")
    async getCategory( @odata.result product: Product, @odata.query query: ODataQuery ): Promise<Category> {
        let request = await mssqlRequest();
        const sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        request.input("Id", product.CategoryId);
        const result = await <Promise<Category[]>>request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = @id AND (${sqlQuery.where})`);
        return convertResults(result)[0];
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    async setCategory( @odata.key id: number, @odata.link link: number ): Promise<number> {
        let request = await mssqlRequest();
        request.input("Id", id);
        request.input("Link", link);
        const result = await <Promise<Product[]>>request.query(`UPDATE Products SET CategoryId = @Link WHERE Id = @Id`);
        return <any>result; //.length; //rowCount;
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key id: number ): Promise<number> {
        let request = await mssqlRequest();
        request.input("Id", id);
        const result = await request.query(`UPDATE Products SET CategoryId = NULL WHERE Id = @Id`); // TODO: 0 / 1 -et kell visszaadni
        return <any>result; //.length; //rowCount;
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        let request = await mssqlRequest();
        let columns: string[] = [];
        let values: any[] = [];
        Object.keys(data).forEach((key: string) => {
            columns.push(key);
            values.push(getConvertedValue(data[key]));
        });
        let sqlCommand = `INSERT INTO Products (${columns.join(", ")}) OUTPUT inserted.* VALUES (${values.join(", ")});`;
        const result = await request.query(sqlCommand);
        return convertResults(result)[0];
    }

    @odata.PUT // replace the content of the row
    async upsert( @odata.key id: string, @odata.body data: any, @odata.context context: any ): Promise<Product> {
        let request = await mssqlRequest();
        let sqlCommandDelete = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
        const dataDeleted = await request.query(sqlCommandDelete);

        //This will save the original properties:
        // const dataToInsert = Object.assign({}, dataDeleted[0], data, { Id: id });
        //This will satisfy the requirements of the unit tests:
        const dataToInsert = Object.assign({}, data, { Id: id });
        let columns: string[] = [];
        let insertedColumns: string[] = [];
        let values: any[] = [];
        Object.keys(dataToInsert).forEach((key: string) => {
            columns.push(key);
            insertedColumns.push("inserted." + key);
            values.push(getConvertedValue(dataToInsert[key]));
        });
        let sqlCommand = `SET IDENTITY_INSERT Products ON;
        INSERT INTO Products (${columns.join(", ")}) OUTPUT ${insertedColumns.join(", ")} VALUES (${values.join(", ")});
        SET IDENTITY_INSERT Products OFF;`;
        const result = await request.query(sqlCommand);
        return convertResults(result)[0];
    }

    @odata.PATCH // update the content of the row (delta)
    async update( @odata.key id: string, @odata.body delta: any ): Promise<number> {
        let request = await mssqlRequest();
        let sets: any[] = [];
        Object.keys(delta).forEach((key: string) => {
            sets.push(key + "=" + getConvertedValue(delta[key]));
        });
        let sqlCommand = `DECLARE @impactedId INT;
        UPDATE Products SET ${sets.join(", ")}, @impactedId = Id WHERE Id = ${id};
        SELECT @impactedId as 'ImpactedId';`;
        const result = await <Promise<any>>request.query(sqlCommand);
        return (result) ? 1 : 0;
    }

    @odata.DELETE
    async remove( @odata.key id: string ): Promise<number> {
        let request = await mssqlRequest();
        let sqlCommand = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
        const result = await <Promise<Product[]>>request.query(sqlCommand);
        return (Array.isArray(result)) ? result.length : 0;
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(@odata.result result:Product): Promise<Product> {
        let request = await mssqlRequest();
        let sqlCommand = "SELECT TOP(1) * FROM Products ORDER BY UnitPrice ASC";
        const results = await <Promise<Product[]>>request.query(sqlCommand);
        result = convertResults(results)[0];
        return result;
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number, @odata.result result:Product[]): Promise<Product[]> {
        let request = await mssqlRequest();
        let sqlCommand = `SELECT * FROM Products WHERE UnitPrice >= ${min} AND UnitPrice <= ${max} ORDER BY UnitPrice`;
        const results = await <Promise<Product[]>>request.query(sqlCommand);
        result = <Product[]>convertResults(results);
        return result;
    }

    @Edm.Action
    async swapPrice( @Edm.String a: number, @Edm.String b: number) {
        let request = await mssqlRequest();
        const result = await <Promise<Product[]>>request.query(`SELECT Id, UnitPrice FROM Products WHERE Id IN (${a}, ${b})`);
        const aProduct = result.find(product => product.Id === a);
        const bProduct = result.find(product => product.Id === b);
        await request.query(`UPDATE Products SET UnitPrice = ${bProduct.UnitPrice} WHERE Id = ${aProduct.Id}`);
        await request.query(`UPDATE Products SET UnitPrice = ${aProduct.UnitPrice} WHERE Id = ${bProduct.Id}`);
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: number, @Edm.Int32 percent: number) {
        let request = await mssqlRequest();
        await request.query(`UPDATE Products SET UnitPrice = ${((100 - percent) / 100)} * UnitPrice WHERE Id = ${productId}`);
    }
}


@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.stream stream, @odata.query query: ODataQuery): Promise<Category[]|void> {
        let request = await mssqlRequest();
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        sqlQuery.orderby = "Id";
        return request.query(sqlQuery.from("Categories"));
    }

    @odata.GET
    async findOne( @odata.key id: string, @odata.stream stream, @odata.query query: ODataQuery): Promise<Category> {
        let request = await mssqlRequest();
        let sqlQuery = createQuery(query);
        sqlQuery.parameters.forEach((value, name) => request.input(name, value));
        request.input("Id", id);
        const result = await <Promise<Product[]>>request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = @id AND (${sqlQuery.where})`);
        return convertResults(result)[0];
    }

  @odata.GET("Products")
  async getProducts( @odata.result category: Category, @odata.query query: ODataQuery): Promise<Product[]> {
    let request = await mssqlRequest();
    const sqlQuery = createQuery(query);
    sqlQuery.parameters.forEach((value, name) => request.input(name, value));
    request.input("categoryId", category.Id);
    const result = await <Promise<Product[]>>request.query(`SELECT ${sqlQuery.select} FROM Products WHERE CategoryId = @categoryId AND (${sqlQuery.where})`);
    return convertResults(result);
  }

  @odata.GET("Products")
  async getProduct( @odata.key productId: number, @odata.result category: Category, @odata.query query: ODataQuery): Promise<Product> {
    let request = await mssqlRequest();
    const sqlQuery = createQuery(query);
    sqlQuery.parameters.forEach((value, name) => request.input(name, value));
    request.input("categoryId", category.Id);
    request.input("productId", productId);
    const result = await <Promise<Product[]>>request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = @productId AND CategoryId = @categoryId AND (${sqlQuery.where})`);
    return convertResults(result)[0];
  }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    async setCategory( @odata.key id: number, @odata.link link: number ): Promise<number> {
        let request = await mssqlRequest();
        request.input("Id", id);
        request.input("Link", link);
        const result = await <Promise<Product[]>>request.query(`UPDATE Products SET CategoryId = @Id WHERE Id = @Link`);
        return <any>result; //.length; //rowCount;
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key id: number, @odata.link link: number ): Promise<number> {
        let request = await mssqlRequest();
        request.input("Id", id);
        const result = await request.query(`UPDATE Products SET CategoryId = NULL WHERE Id = @Id`);
        return <any>result; //.length; //rowCount;
    }


  @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        let request = await mssqlRequest();
        let columns: string[] = [];
        let values: any[] = [];
        Object.keys(data).forEach((key: string) => {
            columns.push(key);
            values.push(getConvertedValue(data[key]));
        });
        let sqlCommand = `INSERT INTO Categories (${columns.join(", ")}) OUTPUT inserted.* VALUES (${values.join(", ")});`;
        const result = await request.query(sqlCommand);
        return convertResults(result)[0]; //convertResults(rows)[0];
    }


    @odata.PUT // replace the content of the row
    async upsert( @odata.key id: string, @odata.body data: any, @odata.context context: any ): Promise<Category> {
        let request = await mssqlRequest();
        let sqlCommandDelete = `DELETE FROM Categories OUTPUT deleted.* WHERE Id = ${id}`;
        const dataDeleted = await request.query(sqlCommandDelete);

        //This will save the original properties:
        // const dataToInsert = Object.assign({}, dataDeleted[0], data, { Id: id });
        //This will satisfy the requirements of the unit tests:
        const dataToInsert = Object.assign({}, data, { Id: id });
        let columns: string[] = [];
        let insertedColumns: string[] = [];
        let values: any[] = [];
        Object.keys(dataToInsert).forEach((key: string) => {
            columns.push(key);
            insertedColumns.push("inserted." + key);
            values.push(getConvertedValue(dataToInsert[key]));
        });
        let sqlCommand = `SET IDENTITY_INSERT Categories ON;
        INSERT INTO Categories (${columns.join(", ")}) OUTPUT ${insertedColumns.join(", ")} VALUES (${values.join(", ")});
        SET IDENTITY_INSERT Categories OFF;`;
        const result = await request.query(sqlCommand);
        return convertResults(result)[0];
    }

    @odata.PATCH // update the content of the row (delta)
    async update( @odata.key id: string, @odata.body delta: any ): Promise<number> {
        let request = await mssqlRequest();
        let sets: any[] = [];
        Object.keys(delta).forEach((key: string) => {
            sets.push(key + "=" + getConvertedValue(delta[key]));
        });
        let sqlCommand = `DECLARE @impactedId INT;
        UPDATE Categories SET ${sets.join(", ")}, @impactedId = Id WHERE Id = ${id};
        SELECT @impactedId as 'ImpactedId';`;
        const result = await <Promise<any>>request.query(sqlCommand);
        return (result) ? 1 : 0;
    }

    @odata.DELETE
    async remove( @odata.key id: string ): Promise<number> {
        let request = await mssqlRequest();
        let sqlCommand = `DELETE FROM Categories OUTPUT deleted.* WHERE Id = ${id}`;
        const result = await <Promise<Product[]>>request.query(sqlCommand);
        return (Array.isArray(result)) ? result.length : 0; //<Product>result[0];
    }
}

function getConvertedValue(par: any): string {
    if (par === true || par === "true") { return '1'; }
    if (par === false || par === "false") { return '0'; }
    if (typeof par === "string") { return "'" + par + "'"; }
    return String(par);
}