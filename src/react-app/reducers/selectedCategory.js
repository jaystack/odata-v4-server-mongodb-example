import actionTypes from "./../actionTypes";
import store from "../store";

function discardChanges(state) {
	const original = store.getState().categories.find(category => category._id === state._id);
	return Object.assign({}, state, original);
}

function updateSelectedCategory(state, data) {
	const updatedCategory = Array.isArray(data) ? data.find(category => category._id === state._id) : data;
	if (!updatedCategory)
		return null;
	return Object.assign({}, state, updatedCategory);
}

export default function (state = null, action) {
	switch (action.type) {
		case actionTypes.SELECT_CATEGORY:
			return action.category ? Object.assign({}, action.category, {products: []}) : null;
		case actionTypes.RESOLVE_GET_CATEGORY_PRODUCTS:
			return state ? Object.assign({}, state, {products: action.items}) : null;
		case actionTypes.MODIFY_CATEGORY:
			return state ? Object.assign({}, state, {[action.propName]: action.propValue}) : null;
		case actionTypes.DISCARD_CATEGORY_MODIFICATIONS:
			return state ? discardChanges(state) : null;
		case actionTypes.RESOLVE_GET_CATEGORIES:
			return state ? updateSelectedCategory(state, action.items) : null;
		case actionTypes.RESOLVE_GET_CATEGORY:
			return state ? updateSelectedCategory(state, action.category) : null;
		case actionTypes.RESOLVE_DELETE_CATEGORY:
			return state && state._id === action.categoryId ? null : state;
		default:
			return state;
	}
}