import store from "../store";
import deepEqual from "deep-equal";

export default function () {
	const state = store.getState();
	const modified = state.selectedProduct;
	if (!modified)
		return false;

	const original = state.products.find(category => category._id === modified._id);
	if (!original)
		return false;

	return !deepEqual(original, modified);
}