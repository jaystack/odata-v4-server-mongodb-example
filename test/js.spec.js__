"use strict";

const { NorthwindServer } = require("../build/js/server");
const { Product, Category } = require("../build/js/model");
const products = require("../build/js/products").default;
const categories = require("../build/js/categories").default;
const coreTest = require("./coreTest.js");

describe("ES Next", () => {
    coreTest(NorthwindServer, {Product, Category}, {products, categories});
});