/// <reference types="mocha" />
let expect = require("chai").expect;
import { ObjectID } from "mongodb";
import * as extend from "extend";
import { NorthwindServer } from "../lib/server";
import { Product, Category } from "../lib/model";
let products = require("../lib/products");
let categories = require("../lib/categories");

function createTest(testcase:string, command:string, compare:any, body?:any){
    it(`${testcase} (${command})`, () => {
        let test = command.split(" ");
        return NorthwindServer.execute(test.slice(1).join(" "), test[0], body).then((result) => {
            expect(result).to.deep.equal(compare);
        });
    });
}

describe("OData V4 MongoDB example server", () => {
    beforeEach(() => {
        return NorthwindServer.execute("/initDb", "POST");
    });

    describe("Products", () => {
        createTest("should get all products", "GET /Products", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Products",
                value: products.map(product => extend({
                    "@odata.id": `http://localhost/Products('${product._id}')`,
                    "@odata.editLink": `http://localhost/Products('${product._id}')`
                }, product))
            },
            elementType: Product,
            contentType: "application/json"
        });

        createTest("should get products by filter", "GET /Products?$filter=Name eq 'Chai'", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Products",
                value: products.filter(product => product.Name == "Chai").map(product => extend({
                    "@odata.id": `http://localhost/Products('${product._id}')`,
                    "@odata.editLink": `http://localhost/Products('${product._id}')`
                }, product))
            },
            elementType: Product,
            contentType: "application/json"
        });

        createTest("should get products by filter and select", "GET /Products?$filter=Name eq 'Chai'&$select=Name,UnitPrice", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Products",
                value: products.filter(product => product.Name == "Chai").map((product:Product) => {
                    return {
                        "@odata.id": `http://localhost/Products('${product._id}')`,
                        "@odata.editLink": `http://localhost/Products('${product._id}')`,
                        Name: product.Name,
                        UnitPrice: product.UnitPrice,
                        _id: product._id
                    };
                })
            },
            elementType: Product,
            contentType: "application/json"
        });

        createTest("should get product by key", "GET /Products('578f2b8c12eaebabec4af23c')", {
            statusCode: 200,
            body: extend({
                "@odata.context": "http://localhost/$metadata#Products/$entity"
            }, products.filter(product => product._id.toString() == "578f2b8c12eaebabec4af23c").map(product => extend({
                    "@odata.id": `http://localhost/Products('${product._id}')`,
                    "@odata.editLink": `http://localhost/Products('${product._id}')`
                }, product))[0]
            ),
            elementType: Product,
            contentType: "application/json"
        });

        it("should create new product", () => {
            return NorthwindServer.execute("/Products", "POST", {
                Name: "New product",
                CategoryId: categories[0]._id
            }).then((result) => {
                expect((<Product>result.body)._id instanceof ObjectID).to.be.true;
                expect(result).to.deep.equal({
                    statusCode: 201,
                    body: {
                        "@odata.context": "http://localhost/$metadata#Products/$entity",
                        "@odata.id": `http://localhost/Products('${(<Product>result.body)._id}')`,
                        "@odata.editLink": `http://localhost/Products('${(<Product>result.body)._id}')`,
                        _id: (<Product>result.body)._id,
                        Name: "New product",
                        CategoryId: categories[0]._id
                    },
                    elementType: Product,
                    contentType: "application/json"
                });
            });
        });

        it("should update product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "PUT", {
                Name: "Chai (updated)"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: {
                            "@odata.context": "http://localhost/$metadata#Products/$entity",
                            "@odata.id": `http://localhost/Products('578f2b8c12eaebabec4af23c')`,
                            "@odata.editLink": `http://localhost/Products('578f2b8c12eaebabec4af23c')`,
                            Name: "Chai (updated)",
                            _id: new ObjectID("578f2b8c12eaebabec4af23c")
                        },
                        elementType: Product,
                        contentType: "application/json"
                    });
                });
            });
        });

        it("should delta update product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "PATCH", {
                Name: "Chai (updated)"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body:  products.filter(product => product._id.toString() == "578f2b8c12eaebabec4af23c").map(product => extend({
                            "@odata.context": "http://localhost/$metadata#Products/$entity",
                            "@odata.id": `http://localhost/Products('${product._id}')`,
                            "@odata.editLink": `http://localhost/Products('${product._id}')`
                        }, product, {
                            Name: "Chai (updated)"
                        }))[0],
                        elementType: Product,
                        contentType: "application/json"
                    });
                });
            });
        });

        it("should delete product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "DELETE").then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')", "GET").then(() => {
                    throw new Error("Product should be deleted.");
                }, (err) => {
                    expect(err.name).to.equal("ResourceNotFoundError");
                });
            });
        });

        createTest("should get category by product", "GET /Products('578f2b8c12eaebabec4af23c')/Category", {
            statusCode: 200,
            body: extend({
                "@odata.context": "http://localhost/$metadata#Categories/$entity"
            }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af289").map(category => extend({
                    "@odata.id": `http://localhost/Categories('${category._id}')`,
                    "@odata.editLink": `http://localhost/Categories('${category._id}')`
                }, category))[0]
            ),
            elementType: Category,
            contentType: "application/json"
        });

        it("should create category reference on product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category/$ref", "POST", {
                "@odata.id": "http://localhost/Categories('578f2baa12eaebabec4af28a')"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: extend({
                            "@odata.context": "http://localhost/$metadata#Categories/$entity"
                        }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af28a").map(category => extend({
                                "@odata.id": `http://localhost/Categories('${category._id}')`,
                                "@odata.editLink": `http://localhost/Categories('${category._id}')`
                            }, category))[0]
                        ),
                        elementType: Category,
                        contentType: "application/json"
                    })
                });
            });
        });

        it("should update category reference on product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category/$ref", "PUT", {
                "@odata.id": "http://localhost/Categories('578f2baa12eaebabec4af28a')"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: extend({
                            "@odata.context": "http://localhost/$metadata#Categories/$entity"
                        }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af28a").map(category => extend({
                                "@odata.id": `http://localhost/Categories('${category._id}')`,
                                "@odata.editLink": `http://localhost/Categories('${category._id}')`
                            }, category))[0]
                        ),
                        elementType: Category,
                        contentType: "application/json"
                    })
                });
            });
        });

        it("should delete category reference on product", () => {
            return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category/$ref", "DELETE").then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    throw new Error("Category reference should be deleted.");
                }, (err) => {
                    expect(err.name).to.equal("ResourceNotFoundError");
                });
            });
        });
    });

    describe("Categories", () => {
        createTest("should get all categories", "GET /Categories", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Categories",
                value: categories.map(category => extend({
                    "@odata.id": `http://localhost/Categories('${category._id}')`,
                    "@odata.editLink": `http://localhost/Categories('${category._id}')`
                }, category))
            },
            elementType: Category,
            contentType: "application/json"
        });

        createTest("should get categories by filter", "GET /Categories?$filter=Name eq 'Beverages'", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Categories",
                value: categories.filter(category => category.Name == "Beverages").map(category => extend({
                    "@odata.id": `http://localhost/Categories('${category._id}')`,
                    "@odata.editLink": `http://localhost/Categories('${category._id}')`
                }, category))
            },
            elementType: Category,
            contentType: "application/json"
        });

        createTest("should get categories by filter and select", "GET /Categories?$filter=Name eq 'Beverages'&$select=Name,Description", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Categories",
                value: categories.filter(category => category.Name == "Beverages").map((category:Category) => {
                    return {
                        "@odata.id": `http://localhost/Categories('${category._id}')`,
                        "@odata.editLink": `http://localhost/Categories('${category._id}')`,
                        Name: category.Name,
                        Description: category.Description,
                        _id: category._id
                    };
                })
            },
            elementType: Category,
            contentType: "application/json"
        });

        createTest("should get category by key", "GET /Categories('578f2baa12eaebabec4af289')", {
            statusCode: 200,
            body: extend({
                "@odata.context": "http://localhost/$metadata#Categories/$entity"
            }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af289").map(category => extend({
                    "@odata.id": `http://localhost/Categories('${category._id}')`,
                    "@odata.editLink": `http://localhost/Categories('${category._id}')`
                }, category))[0]
            ),
            elementType: Category,
            contentType: "application/json"
        });

        it("should create new category", () => {
            return NorthwindServer.execute("/Categories", "POST", {
                Name: "New category",
                Description: "Test category"
            }).then((result) => {
                expect((<Product>result.body)._id instanceof ObjectID).to.be.true;
                expect(result).to.deep.equal({
                    statusCode: 201,
                    body: {
                        "@odata.context": "http://localhost/$metadata#Categories/$entity",
                        "@odata.id": `http://localhost/Categories('${(<Category>result.body)._id}')`,
                        "@odata.editLink": `http://localhost/Categories('${(<Category>result.body)._id}')`,
                        _id: (<Product>result.body)._id,
                        Name: "New category",
                        Description: "Test category"
                    },
                    elementType: Category,
                    contentType: "application/json"
                });
            });
        });

        it("should update category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "PUT", {
                Name: "Beverages (updated)"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: {
                            "@odata.context": "http://localhost/$metadata#Categories/$entity",
                            "@odata.id": `http://localhost/Categories('578f2baa12eaebabec4af289')`,
                            "@odata.editLink": `http://localhost/Categories('578f2baa12eaebabec4af289')`,
                            Name: "Beverages (updated)",
                            _id: new ObjectID("578f2baa12eaebabec4af289")
                        },
                        elementType: Category,
                        contentType: "application/json"
                    });
                });
            });
        });

        it("should delta update category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "PATCH", {
                Name: "Beverages (updated)"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body:  categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af289").map(category => extend({
                            "@odata.context": "http://localhost/$metadata#Categories/$entity",
                            "@odata.id": `http://localhost/Categories('${category._id}')`,
                            "@odata.editLink": `http://localhost/Categories('${category._id}')`
                        }, category, {
                            Name: "Beverages (updated)"
                        }))[0],
                        elementType: Category,
                        contentType: "application/json"
                    });
                });
            });
        });

        it("should delete category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "DELETE").then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')", "GET").then(() => {
                    throw new Error("Product should be deleted.");
                }, (err) => {
                    expect(err.name).to.equal("ResourceNotFoundError");
                });
            });
        });

        createTest("should get products by category", "GET /Categories('578f2baa12eaebabec4af289')/Products", {
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Categories('578f2baa12eaebabec4af289')/Products",
                value: products.filter(product => product.CategoryId.toString() == "578f2baa12eaebabec4af289").map(product => extend({
                    "@odata.id": `http://localhost/Products('${product._id}')`,
                    "@odata.editLink": `http://localhost/Products('${product._id}')`
                }, product))
            },
            elementType: Product,
            contentType: "application/json"
        });

        it("should create product reference on category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af28a')/Products/$ref", "POST", {
                "@odata.id": "http://localhost/Products('578f2b8c12eaebabec4af23c')"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: extend({
                            "@odata.context": "http://localhost/$metadata#Categories/$entity"
                        }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af28a").map(category => extend({
                                "@odata.id": `http://localhost/Categories('${category._id}')`,
                                "@odata.editLink": `http://localhost/Categories('${category._id}')`
                            }, category))[0]
                        ),
                        elementType: Category,
                        contentType: "application/json"
                    })
                });
            });
        });

        it("should update product reference on category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af28a')/Products/$ref", "PUT", {
                "@odata.id": "http://localhost/Products('578f2b8c12eaebabec4af23c')"
            }).then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    expect(result).to.deep.equal({
                        statusCode: 200,
                        body: extend({
                            "@odata.context": "http://localhost/$metadata#Categories/$entity"
                        }, categories.filter(category => category._id.toString() == "578f2baa12eaebabec4af28a").map(category => extend({
                                "@odata.id": `http://localhost/Categories('${category._id}')`,
                                "@odata.editLink": `http://localhost/Categories('${category._id}')`
                            }, category))[0]
                        ),
                        elementType: Category,
                        contentType: "application/json"
                    })
                });
            });
        });

        it("should delete product reference on category", () => {
            return NorthwindServer.execute("/Categories('578f2baa12eaebabec4af289')/Products/$ref?$id=http://localhost/Products('578f2b8c12eaebabec4af23c')", "DELETE").then((result) => {
                expect(result).to.deep.equal({
                    statusCode: 204
                });

                return NorthwindServer.execute("/Products('578f2b8c12eaebabec4af23c')/Category", "GET").then((result) => {
                    throw new Error("Category reference should be deleted.");
                }, (err) => {
                    expect(err.name).to.equal("ResourceNotFoundError");
                });
            });
        });
    });
});