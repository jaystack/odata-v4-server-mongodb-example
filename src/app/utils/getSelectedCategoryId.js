import store from "../store";

export default function () {
	const selectedCategory = store.getState().selectedCategory;
	if (!selectedCategory)
		return null;
	return selectedCategory._id;
}