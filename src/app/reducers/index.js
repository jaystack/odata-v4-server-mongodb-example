import {combineReducers} from "redux";

import categories from "./categories";
import products from "./products";
import categoryFilter from "./categoryFilter";
import selectedCategory from "./selectedCategory";
import productFilter from "./productFilter";
import productOrder from "./productOrder";

export default combineReducers({
	categories,
	products,
	categoryFilter,
	selectedCategory,
	productFilter,
	productOrder,
	logger: (state = null, action) => {console.debug(action); return state;}
});