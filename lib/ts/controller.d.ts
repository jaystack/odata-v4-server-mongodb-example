import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    find(query: ODataQuery): Promise<Product[]>;
    findOne(key: string, query: ODataQuery): Promise<Product>;
    getCategory(result: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: string, link: string): Promise<number>;
    unsetCategory(key: string): Promise<number>;
    insert(data: any): Promise<Product>;
    upsert(key: string, data: any, context: any): Promise<Product>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
    getCheapest(): Promise<Product>;
    getInPriceRange(min: number, max: number): Promise<Product[]>;
    swapPrice(a: string, b: string): Promise<void>;
    discountProduct(productId: string, percent: number): Promise<void>;
}
export declare class CategoriesController extends ODataController {
    find(query: ODataQuery): Promise<Category[]>;
    findOne(key: string, query: ODataQuery): Promise<Category>;
    getProducts(result: Category, query: ODataQuery): Promise<Product[]>;
    getProduct(key: string, result: Category, query: ODataQuery): Promise<Product>;
    setCategory(key: string, link: string): Promise<number>;
    unsetCategory(key: string, link: string): Promise<number>;
    insert(data: any): Promise<Category>;
    upsert(key: string, data: any): Promise<Category>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
}
