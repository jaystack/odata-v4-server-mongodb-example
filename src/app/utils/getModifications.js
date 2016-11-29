import store from "../store";

export default function () {
	const selectedCategory = store.getState().selectedCategory;
	if (!selectedCategory)
		return {};
	return {
		Name: selectedCategory.Name,
		Description: selectedCategory.Description
	};
}