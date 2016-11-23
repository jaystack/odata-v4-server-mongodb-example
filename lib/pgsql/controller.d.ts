import { ODataController, ODataQuery } from "odata-v4-server";
import { Product } from "./model";
export declare class ProductsController extends ODataController {
    find(query: ODataQuery): Promise<Product[]>;
}
