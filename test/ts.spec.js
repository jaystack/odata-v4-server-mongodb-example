"use strict";

const { NorthwindServer } = require("../lib/ts-api/server");
const { Product, Category } = require("../lib/ts-api/model");
const products = require("../lib/ts-api/products").default;
const categories = require("../lib/ts-api/categories").default;
const testCases = require("./test-cases.js");

describe("Mongo TypeScript", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});