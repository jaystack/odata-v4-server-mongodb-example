export declare class Product {
    id: string;
    CategoryId: string;
    Category: Category;
    Discontinued: boolean;
    Name: string;
    QuantityPerUnit: string;
    UnitPrice: number;
    getUnitPrice(result: Product): number;
}
export declare class Category {
    id: string;
    Description: string;
    Name: string;
    Products: Product[];
}
