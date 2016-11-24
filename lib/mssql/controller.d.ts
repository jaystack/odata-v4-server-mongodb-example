import { ODataController, ODataQuery } from "odata-v4-server";
import { Product } from "./model";
export declare class ProductsController extends ODataController {
    find(stream: any, query: ODataQuery): Promise<Product[] | void>;
    findOne(id: string, stream: any, query: ODataQuery): Promise<Product>;
}
export declare class CategoriesController extends ODataController {
}
