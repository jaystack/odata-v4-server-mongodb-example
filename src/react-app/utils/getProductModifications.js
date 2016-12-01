import store from "../store";

export default function () {
	const selectedProduct = store.getState().selectedProduct;
	if (!selectedProduct)
		return {};
	return {
		Name: selectedProduct.Name,
		QuantityPerUnit: selectedProduct.QuantityPerUnit,
		UnitPrice: selectedProduct.UnitPrice,
		Discontinued: selectedProduct.Discontinued,
		CategoryId: selectedProduct.CategoryId
	};
}