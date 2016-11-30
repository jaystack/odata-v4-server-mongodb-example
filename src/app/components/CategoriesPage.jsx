import React from "react";
import CategoryList from "./CategoryList";
import CategoryDetails from './CategoryDetails';

export default function CategoriesPage({categories, selectedCategory, products, categoryFilter}) {

  return (
    <div style={{
      display: "flex",
      flexGrow: 1
    }}>
      <CategoryList categories={categories} categoryFilter={categoryFilter} />
      {
        selectedCategory ? <CategoryDetails
          selectedCategory={selectedCategory}
          products={products}
          /> : null
      }

    </div>
  );
}