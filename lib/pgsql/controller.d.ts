import { ODataController, ODataQuery } from "odata-v4-server";
import { Product, Category } from "./model";
export declare class ProductsController extends ODataController {
    select(query: ODataQuery): Promise<Product[]>;
    selectOne(key: string, query: ODataQuery): Promise<Product>;
    getCategory(product: Product, query: ODataQuery): Promise<Category>;
    setCategory(key: string, link: number): Promise<number>;
}
