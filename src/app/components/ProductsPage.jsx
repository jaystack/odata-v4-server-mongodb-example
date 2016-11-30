import React from "react";
import ProductList from "./ProductList";
//import ProductDetails from './ProductDetails';

export default function ProductsPage({products, selectedProduct, productFilter}) {

	return (
		<div style={{
			display: "flex",
			flexGrow: 1
		}}>
			<ProductList products={products} productFilter={productFilter} />
			{selectedProduct ? <ProductDetails selectedCategory={selectedProduct} /> : null}

		</div>
	);
}