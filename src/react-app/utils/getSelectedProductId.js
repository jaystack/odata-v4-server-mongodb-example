import store from "../store";

export default function () {
	const selectedProduct = store.getState().selectedProduct;
	if (!selectedProduct)
		return null;
	return selectedProduct._id;
}