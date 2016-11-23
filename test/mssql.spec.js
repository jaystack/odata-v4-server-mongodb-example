"use strict";

const { NorthwindServer } = require("../lib/mssql/server");
const { Product, Category } = require("../lib/mssql/model");
const products = require("../lib/mssql/products").default;
const categories = require("../lib/mssql/categories").default;
const testCases = require("./test-cases.sql.js");

describe("MS SQL Server", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});