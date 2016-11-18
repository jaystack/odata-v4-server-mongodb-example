import { ObjectID } from "mongodb";
import { Edm, odata } from "odata-v4-server";
import mongodb from "./connection";

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Products"
})
export class Product{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
    _id

    @Edm.String
    @Edm.Required
    CategoryId

    @Edm.EntityType("Category")
    @Edm.Partner("Products")
    Category

    @Edm.Boolean
    Discontinued

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product title"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    Name

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product English name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    QuantityPerUnit

    @Edm.Decimal
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Unit price of product"
    }, {
        term: "UI.ControlHint",
        string: "Decimal"
    })
    UnitPrice

    @Edm.Function
    @Edm.Decimal
    getUnitPrice(@odata.result result) {
        return result.UnitPrice;
    }

    @Edm.Action
    async invertDiscontinued(@odata.result result) {
        let db = await mongodb();
        await db.collection('Products').findOneAndUpdate(
                {_id: result._id},
                {$set: {Discontinued: !result.Discontinued}});
    }

    @Edm.Action
    async setDiscontinued(@odata.result result, @Edm.Boolean value) {
        let db = await mongodb();
        await db.collection('Products').findOneAndUpdate(
                {_id: result._id},
                {$set: {Discontinued: value}});
    }
}

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Categories"
})
export class Category{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Category identifier"
    },
    {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
    _id

    @Edm.String
    Description

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Category name"
    },
    {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    Name

    @Edm.Collection(Edm.EntityType("Product"))
    @Edm.Partner("Category")
    Products
}