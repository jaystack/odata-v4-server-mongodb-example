import {combineReducers} from "redux";

import categories from "./categories";
import products from "./products";
import categoryFilter from "./categoryFilter";
import selectedCategory from "./selectedCategory";

export default combineReducers({
	categories,
	products,
	categoryFilter,
	selectedCategory,
	logger: (state = null, action) => {console.debug(action); return state;}
});