import store from "../store";
import deepEqual from "deep-equal";

export default function () {
	const state = store.getState();
	const selectedCategory = state.selectedCategory;
	if (!selectedCategory)
		return false;
	
	const modified = Object.assign({}, selectedCategory);
	delete modified.products;

	const original = state.categories.find(category => category._id === modified._id);
	if (!original)
		return false;

	return !deepEqual(original, modified);
}