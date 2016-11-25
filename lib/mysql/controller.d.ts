import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    find(query: ODataQuery): Promise<Product[]>;
    findOne(key: number, query: ODataQuery): Promise<Product>;
    getCategory(result: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: number, link: string): Promise<number>;
    unsetCategory(key: number): Promise<number>;
    insert(data: any): Promise<Product>;
    upsert(key: number, data: any, context: any): Promise<Product>;
    update(key: number, delta: any): Promise<any>;
    remove(key: number): Promise<number>;
    getCheapest(): Promise<any>;
    getInPriceRange(min: number, max: number): Promise<Product[]>;
    swapPrice(key1: number, key2: number): Promise<void>;
    discountProduct(productId: number, percent: number): Promise<void>;
}
export declare class CategoriesController extends ODataController {
    find(query: ODataQuery): Promise<Category[]>;
    findOne(key: number, query: ODataQuery): Promise<Category>;
    getProducts(result: Category, query: ODataQuery): Promise<Product[]>;
    getProduct(key: number, result: Category, query: ODataQuery): Promise<Product>;
    setCategory(key: number, link: string): Promise<number>;
    unsetCategory(key: number, link: string): Promise<number>;
    insert(data: any): Promise<Category>;
    upsert(key: number, data: any): Promise<Category>;
    update(key: number, delta: any): Promise<number>;
    remove(key: number): Promise<number>;
}
