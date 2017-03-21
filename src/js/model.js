import { ObjectID } from "mongodb";
import { Edm, odata } from "odata-v4-server";
import connect from "./connect";

export class Details{
    @Edm.String
    Title

    @Edm.Int32
    Nr
}

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

    @Edm.EntityType(Edm.ForwardRef(() => Category))
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
    @odata.parameter("result", odata.result)
    getUnitPrice(result) {
        return result.UnitPrice;
    }

    @Edm.Action
    @odata.parameter("result", odata.result)
    async invertDiscontinued(result) {
        const db = await connect();
        await db.collection('Products').findOneAndUpdate(
                {_id: result._id},
                {$set: {Discontinued: !result.Discontinued}});
    }

    @Edm.Action
    @odata.parameter("result", odata.result)
    @odata.parameter("value", Edm.Boolean)
    async setDiscontinued(result, @Edm.Boolean value) {
        const db = await connect();
        await db.collection('Products').findOneAndUpdate(
                {_id: result._id},
                {$set: {Discontinued: value}});
    }

    @Edm.ComplexType(Details)
    Details
}

@odata.namespace("NorthwindES")
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

    @Edm.Collection(Edm.EntityType(Product))
    @Edm.Partner("Category")
    Products
}