"use strict";

const { NorthwindServer } = require("../lib/mysql/server");
const { Product, Category } = require("../lib/mysql/model");
const products = require("../src/mysql/products");
const categories = require("../src/mysql/categories");
const testCases = require("./test-cases.sql.js");

describe("MySQL", _ => {
    testCases(NorthwindServer, { Product, Category }, { products, categories });
})