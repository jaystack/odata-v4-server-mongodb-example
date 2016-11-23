import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    find(query: ODataQuery): Promise<Product[]>;
    findOne(key: string, query: ODataQuery): Promise<Product>;
    getCategory(result: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: string, link: string): Promise<number>;
    unsetCategory(key: string): Promise<number>;
    insert(data: any): Promise<Product>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
}
export declare class CategoriesController extends ODataController {
}
