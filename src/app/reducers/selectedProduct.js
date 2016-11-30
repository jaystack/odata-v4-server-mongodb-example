import actionTypes from "./../actionTypes";
import store from "../store";

function discardChanges(state) {
	const original = store.getState().products.find(product => product._id === state._id);
	return Object.assign({}, state, original);
}

function updateSelectedProduct(state, newProducts) {
	const updatedProduct = newProducts.find(product => product._id === state._id);
	if (!updatedProduct)
		return null;
	return Object.assign({}, state, updatedProduct);
}

export default function (state = null, action) {
	switch (action.type) {
		case actionTypes.SELECT_PRODUCT:
			return Object.assign({}, action.product);
		case actionTypes.MODIFY_PRODUCT:
			return state ? Object.assign({}, state, {[action.propName]: action.propValue}) : null;
		case actionTypes.DISCARD_PRODUCT_MODIFICATIONS:
			return state ? discardChanges(state) : null;
		case actionTypes.RESOLVE_GET_PRODUCTS:
			return state ? updateSelectedProduct(state, action.items) : null;
		default:
			return state;
	}
}