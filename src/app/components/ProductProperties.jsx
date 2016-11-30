import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { modifyProduct, discardProductModifications, saveProductModifications, deleteProduct } from "../actions";
import areChanges from "../utils/areProductChanges";
import ConfirmDialog from "./ConfirmDialog";

export default class ProductProperties extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpenConfirmDialog: false };
  }

  handleDelete() {
    this.setState({ isOpenConfirmDialog: true });
  }

  handleCancelDeleting() {
    this.setState({ isOpenConfirmDialog: false });
  }

  handleSubmitDeleting() {
    this.setState({ isOpenConfirmDialog: false });
    deleteProduct();
  }

  render() {
    return (
      <Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
        <CardHeader title="Properties" subtitle="Here you can set the products properties" />
        <CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
          <TextField
            floatingLabelText="Name"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.props.selectedProduct.Name}
            onChange={evt => modifyProduct("Name", evt.target.value)}
            />
        </CardText>
        <CardActions>
          <RaisedButton label="Save" primary={true} disabled={!areChanges()} onTouchTap={saveProductModifications} />
          <RaisedButton label="Discard" disabled={!areChanges()} onTouchTap={discardProductModifications} />
          <RaisedButton label="Delete" secondary={true} disabled={this.state.isOpenConfirmDialog} onTouchTap={() => this.handleDelete()} />
          <ConfirmDialog
            open={this.state.isOpenConfirmDialog}
            text={`Are your sure you want to delete this product: ${this.props.selectedProduct.Name} ?`}
            onCancel={() => this.handleCancelDeleting()}
            onSubmit={() => this.handleSubmitDeleting()}
            />
        </CardActions>
      </Card>
    );
  }

}