import actionTypes from "./../actionTypes";

export default function (state = null, action) {
	switch (action.type) {
		case actionTypes.SELECT_CATEGORY:
			return Object.assign({}, action.category, {products: []});
		case actionTypes.RESOLVE_GET_CATEGORY_PRODUCTS:
			return state && action.categoryId === state._id ? Object.assign({}, state, {products: action.items}) : null;
		default:
			return state;
	}
}