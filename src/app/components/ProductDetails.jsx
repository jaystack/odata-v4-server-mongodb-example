import React from "react";

import ProductProperties from "./ProductProperties";

export default class ProductDetails extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.selectedProduct !== this.props.selectedProduct)
			return true;
    return false;
  }

  render() {
    return (
      <div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start", overflowY: "auto" }}>
        <ProductProperties selectedProduct={this.props.selectedProduct} />
      </div>
    );
  }
}