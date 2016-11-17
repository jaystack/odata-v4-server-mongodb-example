"use strict";

const { NorthwindServer } = require("../build/ts/server");
const { Product, Category } = require("../build/ts/model");
const products = require("../build/ts/products").default;
const categories = require("../build/ts/categories").default;
const coreTest = require("./coreTest.js");

describe("Typescript", () => {
    coreTest(NorthwindServer, {Product, Category}, {products, categories});
});