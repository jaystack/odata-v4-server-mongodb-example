import {combineReducers} from "redux";

import categories from "./categories";
import products from "./products";
import selectedCategory from "./selectedCategory";

export default combineReducers({
	categories,
	products,
	selectedCategory,
	//logger: (state = null, action) => {console.debug(action); return state;}
});