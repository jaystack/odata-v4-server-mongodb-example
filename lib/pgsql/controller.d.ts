import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    select(query: ODataQuery): Promise<Product[]>;
    selectOne(key: number, query: ODataQuery): Promise<Product>;
    getCategory(product: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: number, link: number): Promise<number>;
    unsetCategory(key: number): Promise<number>;
    insert(data: any): Promise<Product>;
    upsert(key: number, data: any, context: any): Promise<Product>;
    update(key: number, delta: any): Promise<number>;
    remove(key: number): Promise<number>;
}
export declare class CategoriesController extends ODataController {
    select(query: ODataQuery): Promise<Category[]>;
    selectOne(key: number, query: ODataQuery): Promise<Category>;
    insert(data: any): Promise<Category>;
    upsert(key: number, data: any, context: any): Promise<Category>;
    update(key: number, delta: any): Promise<number>;
    remove(key: number): Promise<number>;
}
