"use strict";

const { NorthwindServer } = require("../lib/pgsql/server");
const { Product, Category } = require("../lib/pgsql/model");
const products = require("../lib/pgsql/products").default;
const categories = require("../lib/pgsql/categories").default;
const testCases = require("./test-cases-sql.js");

describe("Postgres", () => {
    testCases(NorthwindServer, {Product, Category}, {products, categories});
});