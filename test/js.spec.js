"use strict";

const { NorthwindServer } = require("../lib/js-api/server");
const { Product, Category } = require("../lib/js-api/model");
const products = require("../lib/js-api/products").default;
const categories = require("../lib/js-api/categories").default;
const testCases = require("./test-cases.js");

describe("Mongo ES Next", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});