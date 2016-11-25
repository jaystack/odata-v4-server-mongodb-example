import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    find(stream: any, query: ODataQuery): Promise<Product[] | void>;
    findOne(id: string, stream: any, query: ODataQuery): Promise<Product>;
    getCategory(product: Product, query: ODataQuery): Promise<Category>;
    setCategory(id: number, link: number): Promise<number>;
    unsetCategory(id: number): Promise<number>;
    insert(data: any): Promise<Product>;
    upsert(key: string, data: any, context: any): Promise<Product>;
    update(id: string, delta: any): Promise<number>;
    remove(id: string): Promise<number>;
}
export declare class CategoriesController extends ODataController {
}
