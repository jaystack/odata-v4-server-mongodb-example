import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import AddIcon from 'material-ui/svg-icons/content/add';
import AssignProductToCategoryCard from "./AssignProductToCategoryCard";
import { deleteProductFromCategory } from "../actions";

function renderProductClearButton(productId) {
  return (
    <IconButton onTouchTap={() => deleteProductFromCategory(productId)}>
      <ClearIcon />
    </IconButton>
  );
}

function renderProduct(product) {
  return (
    <div key={product._id}>
      <ListItem
        primaryText={product.Name}
        rightIconButton={renderProductClearButton(product._id)}
        />
      <Divider />
    </div>
  );
}

function renderProductList(assignedProducts) {
  return assignedProducts.length > 0 ? (<List>
    {assignedProducts.map(renderProduct)}
  </List>) : null;
}

function getSelectableProducts(assignedProducts, allProducts) {
  return allProducts
    .filter(product => !assignedProducts.map(p => p._id).includes(product._id))
    .map(product => ({ value: product._id, text: product.Name }));
}

export default class CategoryProductList extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.assignedProducts !== this.props.assignedProducts ||
      nextProps.allProducts !== this.props.allProducts
    ) return true;
    return false;
  }

  render() {
    const selectableProducts = getSelectableProducts(this.props.assignedProducts || [], this.props.allProducts || []);

    return (
      <Card style={{ flex: "2 1 0", margin: "20px" }}>
        <CardHeader title="Products" subtitle="Here are listed the assigned products" />
        <CardText>
          <AssignProductToCategoryCard selectableProducts={selectableProducts} />
          {renderProductList(this.props.assignedProducts)}
        </CardText>
      </Card>
    );
  }

}