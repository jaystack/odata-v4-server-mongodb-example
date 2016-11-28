import React from "react";

import CategoryProperties from "./CategoryProperties";
import CategoryProductList from "./CategoryProductList";

export default function CategoryDetails({selectedCategory, products}) {
	return (
		<div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start", overflowY: "auto" }}>
			<CategoryProperties selectedCategory={selectedCategory} />
			<CategoryProductList
				categoryId={selectedCategory._id}
				assignedProducts={selectedCategory.products}
				allProducts={products}
				/>
		</div>
	);
}