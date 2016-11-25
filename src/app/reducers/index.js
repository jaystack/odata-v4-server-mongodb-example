import {combineReducers} from "redux";

import categories from "./categories";
import products from "./products";

export default combineReducers({
	categories,
	products
});