"use strict";

const { NorthwindServer } = require("../lib/mongo/server");
const { Product, Category } = require("../lib/mongo/model");
const products = require("../lib/mongo/products").default;
const categories = require("../lib/mongo/categories").default;
const testCases = require("./test-cases.js");

describe("Mongo TypeScript", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});