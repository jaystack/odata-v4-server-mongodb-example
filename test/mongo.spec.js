"use strict";

/*const { NorthwindServer } = require("../lib/mongo/server");
const { Product, Category } = require("../lib/mongo/model");*/
const { NorthwindServer } = require("../lib/mysql/server");
const { Product, Category } = require("../lib/mysql/model");
const products = require("../lib/mongo/products").default;
const categories = require("../lib/mongo/categories").default;
const testCases = require("./test-cases.js");

/*describe("Mongo", () => {
    testCases(NorthwindServer, { Product, Category }, { products, categories });
});*/

describe("MySQL", _ => {
    testCases(NorthwindServer, { Product, Category }, { products, categories });
})