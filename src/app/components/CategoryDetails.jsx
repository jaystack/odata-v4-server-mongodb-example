import React from "react";

import CategoryProperties from "./CategoryProperties";
import CategoryProductList from "./CategoryProductList";

export default class CategoryDetails extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.selectedCategory !== this.props.selectedCategory ||
      nextProps.products !== this.props.products
    ) return true;
    return false;
  }

  render() {
    return (
      <div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start", overflowY: "auto" }}>
        <CategoryProperties selectedCategory={this.props.selectedCategory} />
        <CategoryProductList
          categoryId={this.props.selectedCategory._id}
          assignedProducts={this.props.selectedCategory.products}
          allProducts={this.props.products}
          />
      </div>
    );
  }
}