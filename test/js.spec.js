"use strict";

const { NorthwindServer } = require("../lib/js/server");
const { Product, Category } = require("../lib/js/model");
const products = require("../lib/js/products").default;
const categories = require("../lib/js/categories").default;
const testCases = require("./test-cases.js");

describe("Mongo ES Next", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});