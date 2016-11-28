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
const convertResults_1 = require("./utils/convertResults");
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
            //request.query(`SELECT UnitPrice FROM "Products" WHERE "Id" = 30`);
            return convertResults_1.default(output);
        });
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
    findOne(id, stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            request.input("Id", id);
            const result = yield request.query(`SELECT ${sqlQuery.select} FROM Products WHERE Id = @id AND (${sqlQuery.where})`);
            return convertResults_1.default(result)[0];
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
            return convertResults_1.default(result)[0];
        });
    }
    setCategory(id, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            request.input("Id", id);
            request.input("Link", link);
            const result = yield request.query(`UPDATE Products SET CategoryId = @Link WHERE Id = @Id`); // TODO: 0 / 1 -et kell visszaadni
            return result; //.length;
        });
    }
    unsetCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            request.input("Id", id);
            const result = yield request.query(`UPDATE Products SET CategoryId = NULL WHERE Id = @Id`); // TODO: 0 / 1 -et kell visszaadni
            return result; //rowCount;
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let columns = [];
            let values = [];
            Object.keys(data).forEach((key) => {
                columns.push(key);
                values.push(addQuote(data[key]));
            });
            let sqlCommand = `INSERT INTO Products (${columns.join(", ")}) OUTPUT inserted.* VALUES (${values.join(", ")});`;
            //console.log("\n\n\n======================= Products POST sqlCommand:\n" + sqlCommand,"\n");
            const result = yield request.query(sqlCommand);
            //console.log("\n\n\n===> result:", JSON.stringify(result, null, 2));
            return convertResults_1.default(result)[0]; //convertResults(rows)[0];
        });
    }
    upsert(id, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlCommandDelete = `DELETE FROM Products OUTPUT deleted.* WHERE Id = ${id}`;
            //console.log("\n\n\n======================= Products PUT sqlCommandDelete:\n" + sqlCommandDelete,"\n");
            const dataDeleted = yield request.query(sqlCommandDelete);
            //console.log("\n\n===> dataDeleted:", JSON.stringify(dataDeleted, null, 2));
            // This will save the original properties:
            // const dataToInsert = Object.assign({}, dataDeleted[0], data, { Id: id });
            // This will satisfy the requirements of the unit tests:
            const dataToInsert = Object.assign({}, data, { Id: id });
            //console.log("\n\n===> dataToInsert:", JSON.stringify(dataToInsert, null, 2));
            let columns = [];
            let insertedColumns = [];
            let values = [];
            Object.keys(dataToInsert).forEach((key) => {
                columns.push(key);
                insertedColumns.push("inserted." + key);
                values.push(addQuote(dataToInsert[key]));
            });
            let sqlCommand = `SET IDENTITY_INSERT Products ON;
        INSERT INTO Products (${columns.join(", ")}) OUTPUT ${insertedColumns.join(", ")} VALUES (${values.join(", ")});
        SET IDENTITY_INSERT Products OFF;`;
            console.log("\n\n\n======================= Products PUT sqlCommand:\n" + sqlCommand, "\n");
            const result = yield request.query(sqlCommand);
            return convertResults_1.default(result)[0]; //convertResults(rows)[0];
        });
    }
    update(id, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sets = [];
            Object.keys(delta).forEach((key) => {
                sets.push(key + "=" + addQuote(delta[key]));
            });
            let sqlCommand = `DECLARE @impactedId INT;
        UPDATE Products SET ${sets.join(", ")}, @impactedId = Id WHERE Id = ${id};
        SELECT @impactedId as 'ImpactedId';`;
            const result = yield request.query(sqlCommand);
            return (result) ? 1 : 0; //<Product>result[0];
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
    getCheapest(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlCommand = "SELECT TOP(1) * FROM Products ORDER BY UnitPrice ASC";
            console.log("\n\n===> Product/Northwind.getCheapest sqlCommand:", sqlCommand);
            const results = yield request.query(sqlCommand);
            result = convertResults_1.default(results)[0];
            console.log("%%%%%", result);
            return result;
        });
    }
    getInPriceRange(min, max, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlCommand = `SELECT * FROM Products WHERE UnitPrice >= ${min} AND UnitPrice <= ${max} ORDER BY UnitPrice`;
            const results = yield request.query(sqlCommand);
            result = convertResults_1.default(results);
            console.log("===> getInPriceRange:", result);
            console.log(sqlCommand);
            return result;
        });
    }
    swapPrice(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            const result = yield request.query(`SELECT Id, UnitPrice FROM Products WHERE Id IN (${a}, ${b})`);
            console.log("===> swapPrice Select result:", result);
            const aProduct = result.find(product => product.Id === a);
            const bProduct = result.find(product => product.Id === b);
            yield request.query(`UPDATE Products SET UnitPrice = ${bProduct.UnitPrice} WHERE Id = ${aProduct.Id}`);
            yield request.query(`UPDATE Products SET UnitPrice = ${aProduct.UnitPrice} WHERE Id = ${bProduct.Id}`);
        });
    }
    discountProduct(productId, percent) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            yield request.query(`UPDATE Products SET UnitPrice = ${((100 - percent) / 100)} * UnitPrice WHERE Id = ${productId}`);
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
__decorate([
    odata_v4_server_1.Edm.Function,
    odata_v4_server_1.Edm.EntityType(model_1.Product),
    __param(0, odata_v4_server_1.odata.result)
], ProductsController.prototype, "getCheapest", null);
__decorate([
    odata_v4_server_1.Edm.Function,
    odata_v4_server_1.Edm.Collection(odata_v4_server_1.Edm.EntityType(model_1.Product)),
    __param(0, odata_v4_server_1.Edm.Decimal),
    __param(1, odata_v4_server_1.Edm.Decimal),
    __param(2, odata_v4_server_1.odata.result)
], ProductsController.prototype, "getInPriceRange", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String),
    __param(1, odata_v4_server_1.Edm.String)
], ProductsController.prototype, "swapPrice", null);
__decorate([
    odata_v4_server_1.Edm.Action,
    __param(0, odata_v4_server_1.Edm.String),
    __param(1, odata_v4_server_1.Edm.Int32)
], ProductsController.prototype, "discountProduct", null);
ProductsController = __decorate([
    odata_v4_server_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends odata_v4_server_1.ODataController {
    find(stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let output = request.pipe(stream);
            let sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            sqlQuery.orderby = "Id";
            request.query(sqlQuery.from("Categories"));
            return convertResults_1.default(output);
        });
    }
    findOne(id, stream, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default();
            let request = new mssql.Request(connection);
            let sqlQuery = odata_v4_mssql_1.createQuery(query);
            sqlQuery.parameters.forEach((value, name) => request.input(name, value));
            request.input("Id", id);
            const result = yield request.query(`SELECT ${sqlQuery.select} FROM Categories WHERE Id = @id AND (${sqlQuery.where})`);
            return convertResults_1.default(result)[0];
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.stream),
    __param(1, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key),
    __param(1, odata_v4_server_1.odata.stream),
    __param(2, odata_v4_server_1.odata.query)
], CategoriesController.prototype, "findOne", null);
CategoriesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
function addQuote(par) {
    if (par === true || par === "true") {
        return '1';
    }
    if (par === false || par === "false") {
        return '0';
    }
    if (typeof par === "string") {
        return "'" + par + "'";
    }
    return String(par);
}
//# sourceMappingURL=controller.js.map