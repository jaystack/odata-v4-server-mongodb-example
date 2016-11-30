import React from "react";

import ProductProperties from "./ProductProperties";
import AssignCategoryToProductCard from "./AssignCategoryToProductCard";

export default class ProductDetails extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.selectedProduct !== this.props.selectedProduct ||
      nextProps.categories !== this.props.categories
    )
			return true;
    return false;
  }

  render() {
    return (
      <div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start", overflowY: "auto" }}>
        <ProductProperties selectedProduct={this.props.selectedProduct} />
        <AssignCategoryToProductCard selectedProduct={this.props.selectedProduct} categories={this.props.categories} />
      </div>
    );
  }
}