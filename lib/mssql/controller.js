"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mssql = require("mssql");
const odata_v4_mssql_1 = require("odata-v4-mssql");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connection_1 = require("./connection");
let ProductsController = class ProductsController extends odata_v4_server_1.ODataController {
    find(stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let output = request.pipe(stream);
            let sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            sqlQuery.orderby = "Id";
            request.query(sqlQuery.from("Products"));
            return output;
        });
    }
    findOne(id, stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            request.input("Id", id);
            const result = yield request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = @id AND (${sqlQuery.where})`);
            return result[0];
        });
    }
    getCategory(product, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            const sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            request.input("Id", product.CategoryId);
            const result = yield request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = @id AND (${sqlQuery.where})`);
            return result[0];
        });
    }
    setCategory(id, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            request.input("Id", id);
            request.input("Link", link);
            const result = yield request.query(`UPDATE Products SET CategoryId = @Link WHERE Id = @Id`);
            return result; //.length;
        });
    }
    unsetCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            request.input("Id", id);
            const result = yield request.query(`UPDATE Products SET CategoryId = NULL WHERE Id = @Id`);
            return result; //rowCount;
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let columns;
            let values;
            Object.keys(data).forEach((key) => {
                columns.push(key);
                values.push(addQuote(data[key]));
            });
            let sqlCommand = `INSERT INTO Products (${columns.join(", ")}) OUTPUT inserted.* VALUES (${values.join(", ")});`;
            const result = yield request.query(sqlCommand);
            return result[0]; //convertResults(rows)[0];
        });
    }
    upsert(key, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    update(id, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sets;
            Object.keys(delta).forEach((key) => {
                sets.push(key + "=" + addQuote(delta[key]));
            });
            let sqlCommand = `DECLARE @impactedId INT;
        UPDATE Products SET ${sets.join(", ")}, @impactedId = inserted.Id WHERE Id = ${id};
        SELECT @impactedId;`;
            const result = yield request.query(sqlCommand);
            return (result) ? 1 : 0; //<Product>result[0];
            /*
            DECLARE @id INT
            
            UPDATE Foo
            SET Bar = 1, @id = id
            WHERE Baz = 2
            
            SELECT @id
            */
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlCommand = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
            const result = yield request.query(sqlCommand);
            return (Array.isArray(result)) ? result.length : 0; //<Product>result[0];
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.stream),
    __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.stream),
    __param(2, odata_v4_server_1.odata.query)
], ProductsController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.GET("Category"),
    __param(0, odata_v4_server_1.odata.result),
    __param(1, odata_v4_server_1.odata.query)
], ProductsController.prototype, "getCategory", null);
__decorate([
    odata_v4_server_1.odata.POST("Category").$ref,
    odata_v4_server_1.odata.PUT("Category").$ref,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.link)
], ProductsController.prototype, "setCategory", null);
__decorate([
    odata_v4_server_1.odata.DELETE("Category").$ref,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "unsetCategory", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], ProductsController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body),
    __param(2, odata_v4_server_1.odata.context)
], ProductsController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.body)
], ProductsController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], ProductsController.prototype, "remove", null);
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
// @odata.GET("Category")
// async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
//     const connection = await mssqlConnection();
//     const request = new mssql.Request(connection);
//     const sqlQuery = createQuery(query);
//     console.log("\n\n===> @odata.GET(\"Category\") sqlQuery:", JSON.stringify(sqlQuery, null, 2));
//     const result = await <Promise<Product>>request.query(sqlQuery.from('"Categories"'), sqlQuery.parameters);
//     return result[0];
//     // return await new Promise<Category>((resolve, reject) =>
//     //     //request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ? AND (${sqlQuery.where})`, [result.CategoryId, ...sqlQuery.parameters], (err, result) =>
//     //     request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = ${result.CategoryId} AND (${sqlQuery.where})`, (err, result) => {
//     //         return (err) ? reject(err) : resolve(result[0]);
//     //     }));
// }
// @odata.POST("Category").$ref
// @odata.PUT("Category").$ref
// async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
//     const connection = await mssqlConnection();
//     const request = new mssql.Request(connection);
//     return await new Promise<number>((resolve, reject) =>
//         //request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ? `, [key], (err, result) =>
//         request.query(`UPDATE Categories SET CategoryId = link WHERE Id = ${key}`, (err, result) => {
//             //connection.close();
//             return (err) ? reject(err) : resolve(result[0]);
//         }));
// }
// /*@odata.DELETE("Category").$ref
// async unsetCategory( @odata.key key: string): Promise<number> {
//     let db = await mongodb();
//     return await db.collection("Products").updateOne({
//         Id: new ObjectID(key)
//     }, {
//             $unset: { CategoryId: 1 }
//         }).then((result) => {
//             return result.modifiedCount;
//         });
// }*/
// @odata.POST
// async insert( @odata.body data: any): Promise<Product> {
//     const connection = await mssqlConnection();
//     const request1 = new mssql.Request(connection);
//     await new Promise<any>((resolve, reject) => request1.query(`USE northwind_mssql_test_db`, (err, result) => err ? reject(err) : resolve(result)));
//     return await new Promise<Product>((resolve, reject) => {
//         console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//         console.log(data);
//         console.log([data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null]);
//         const request2 = new mssql.Request(connection);
//         //request2.query(`INSERT INTO Products VALUES (?,?,?,?,?,?);`, [data.QuantityPerUnit || null, data.UnitPrice || null, data.CategoryId || null, data.Name || null, data.Discontinued || null, data.Id || null], (err, result) =>
//         request2.query(`INSERT INTO Products VALUES (${(data.QuantityPerUnit || null)}, ${(data.UnitPrice || null)}, ${(data.CategoryId || null)}, ${(data.Name || null)}, ${(data.Discontinued || null)}, ${(data.Id || null)});`, (err, result) => {
//             //connection.close();
//             return (err) ? reject(err) : resolve(result[0]);
//         });
//     });
// }
// /*@odata.PUT
// async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
//     let db = await mongodb();
//     if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId);
//     return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, data, {
//         upsert: true
//     }).then((result) => {
//         data.Id = result.upsertedId
//         return data;
//     });
// }*/
// getDeltaObjectInSQL(delta: any): string {
//     const deltaKeys = Object.keys(delta);
//     if (deltaKeys.length == 1) return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
//     return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
// }
// @odata.PATCH
// async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
//     /*let db = await mongodb();
//     if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId);
//     return await db.collection("Products").updateOne({ Id: new ObjectID(key) }, { $set: delta }).then(result => result.modifiedCount);*/
//     console.log("++++++++++++++++++");
//     console.log(delta);
//     console.log(key);
//     const connection = await mssqlConnection();
//     const request = new mssql.Request(connection);
//     return await new Promise<number>((resolve, reject) =>
//         //request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ? `, [key], (err, result) =>
//         request.query(`UPDATE Products SET ${this.getDeltaObjectInSQL(delta)} WHERE Id = ${key}`, (err, result) => {
//             //connection.close();
//             return (err) ? reject(err) : resolve(result[0]);
//         }));
// }
// /*@odata.DELETE
// async remove( @odata.key key: string): Promise<number> {
//     let db = await mongodb();
//     return await db.collection("Products").deleteOne({ Id: new ObjectID(key) }).then(result => result.deletedCount);
// }
// @Edm.Function
// @Edm.EntityType(Product)
// async getCheapest(): Promise<Product> {
//     let db = await mongodb();
//     return (await db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
// }
// @Edm.Function
// @Edm.Collection(Edm.EntityType(Product))
// async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
//     let db = await mongodb();
//     return await db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
// }
// @Edm.Action
// async swapPrice( @Edm.String a: string, @Edm.String b: string) {
//     let db = await mongodb();
//     const products = await db.collection("Products").find({ Id: { $in: [new ObjectID(a), new ObjectID(b)] } }, { UnitPrice: 1 }).toArray();
//     const aProduct = products.find(product => product.Id.toHexString() === a);
//     const bProduct = products.find(product => product.Id.toHexString() === b);
//     await db.collection("Products").update({ Id: new ObjectID(a) }, { $set: { UnitPrice: bProduct.UnitPrice } });
//     await db.collection("Products").update({ Id: new ObjectID(b) }, { $set: { UnitPrice: aProduct.UnitPrice } });
// }
// @Edm.Action
// async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
//     let db = await mongodb();
//     const product = await db.collection("Products").findOne({ Id: new ObjectID(productId) });
//     const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
//     await db.collection("Products").update({ Id: new ObjectID(productId) }, { $set: { UnitPrice: discountedPrice } });
// }*/
//}
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
};
CategoriesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
function addQuote(par) {
    if (typeof par === "string") {
        return par;
    }
    return "'" + par.toString + "'";
}
//# sourceMappingURL=controller.js.map