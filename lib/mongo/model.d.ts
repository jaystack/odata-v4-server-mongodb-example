import { ObjectID } from "mongodb";
export declare class Product {
    _id: ObjectID;
    CategoryId: string;
    Category: Category;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
    getUnitPrice(result: Product): number;
    invertDiscontinued(result: Product): Promise<void>;
    setDiscontinued(result: Product, value: boolean): Promise<void>;
}
export declare class Category {
    _id: ObjectID;
    Description: string;
    Name: string;
    Products: Product[];
}
