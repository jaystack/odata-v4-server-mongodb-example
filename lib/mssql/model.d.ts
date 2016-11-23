export declare class Product {
    id: number;
    CategoryId: number;
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
    id: number;
    Description: string;
    Name: string;
    Products: Product[];
}
