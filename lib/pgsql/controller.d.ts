import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    select(query: ODataQuery): Promise<Product[]>;
    selectOne(key: number, query: ODataQuery): Promise<Product>;
    getCategory(product: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: number, link: number): Promise<number>;
    unsetCategory(key: number): Promise<number>;
    insert(data: any): Promise<Product>;
    upsert(key: string, data: any, context: any): Promise<Product>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
}
