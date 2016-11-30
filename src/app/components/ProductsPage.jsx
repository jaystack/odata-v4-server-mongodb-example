import React from "react";
import ProductList from "./ProductList";
import ProductDetails from './ProductDetails';

export default function ProductsPage({products, selectedProduct, productFilter, productOrder, categories}) {

	return (
		<div style={{
			display: "flex",
			flexGrow: 1
		}}>
			<ProductList products={products} productFilter={productFilter} productOrder={productOrder} />
			{selectedProduct ? <ProductDetails selectedProduct={selectedProduct} categories={categories} /> : null}

		</div>
	);
}