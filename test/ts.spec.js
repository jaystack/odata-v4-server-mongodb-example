const { NorthwindServer } = require("../lib/ts/server");
const { Product, Category } = require("../lib/ts/model");
const products = require("../lib/ts/products").default;
const categories = require("../lib/ts/categories").default;
const testCases = require("./test-cases.js");

describe("Mongo TypeScript", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});