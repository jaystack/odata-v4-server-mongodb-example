import actionTypes from "./../actionTypes";
import store from "../store";

function discardChanges(state) {
	const original = store.getState().products.find(product => product._id === state._id);
	return Object.assign({}, state, original);
}

function updateSelectedProduct(state, data) {
	const updatedProduct = Array.isArray(data) ? data.find(product => product._id === state._id) : data;
	if (!updatedProduct)
		return null;
	return Object.assign({}, updatedProduct);
}

function updateProductCategory(state, productId, categoryId) {
	if (state._id !== productId)
		return;
	if (categoryId)
		return Object.assign({}, state, {CategoryId: categoryId});
	else {
		const newState = Object.assign({}, state);
		delete newState.CategoryId;
		return newState;
	}
}

export default function (state = null, action) {
	switch (action.type) {
		case actionTypes.SELECT_PRODUCT:
			return action.product ? Object.assign({}, action.product) : null;
		case actionTypes.MODIFY_PRODUCT:
			return state ? Object.assign({}, state, {[action.propName]: action.propValue}) : null;
		case actionTypes.DISCARD_PRODUCT_MODIFICATIONS:
			return state ? discardChanges(state) : null;
		case actionTypes.RESOLVE_GET_PRODUCTS:
			return state ? updateSelectedProduct(state, action.items) : null;
		case actionTypes.RESOLVE_GET_PRODUCT:
			return state ? updateSelectedProduct(state, action.product) : null;
		case actionTypes.RESOLVE_SET_PRODUCT_CATEGORY:
			return state ? updateProductCategory(state, action.productId, action.categoryId) : null;
		case actionTypes.RESOLVE_ADD_PRODUCT_TO_CATEGORY:
			return state ? updateProductCategory(state, action.productId, action.categoryId) : null;
		case actionTypes.RESOLVE_DELETE_PRODUCT_FROM_CATEGORY:
			return state ? updateProductCategory(state, action.productId, null) : null;
		case actionTypes.RESOLVE_DELETE_PRODUCT:
			return state && state._id === action.productId ? null : state;
		default:
			return state;
	}
}