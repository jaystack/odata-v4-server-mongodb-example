"use strict";

const { NorthwindServer } = require("../lib/mongo-es/server");
const { Product, Category } = require("../lib/mongo-es/model");
const products = require("../lib/mongo-es/products").default;
const categories = require("../lib/mongo-es/categories").default;
const testCases = require("./test-cases-mongo.js");

describe("Mongo ES Next", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});