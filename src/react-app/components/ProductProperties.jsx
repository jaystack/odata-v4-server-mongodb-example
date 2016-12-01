import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import areChanges from "../utils/areProductChanges";
import ConfirmDialog from "./ConfirmDialog";
import { modifyProduct, discardProductModifications, saveProductModifications, deleteProduct } from "../actions";

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
				<CardHeader
					title="Properties"
					subtitle="Here you can set the products properties"
					titleStyle={{ fontSize: "20px" }} />
				<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
					<TextField
						floatingLabelText="Name"
						floatingLabelFixed={true}
						fullWidth={true}
						value={this.props.selectedProduct.Name}
						onChange={evt => modifyProduct("Name", evt.target.value)}
						/>
					<TextField
						floatingLabelText="Quantity per unit"
						floatingLabelFixed={true}
						fullWidth={true}
						value={this.props.selectedProduct.QuantityPerUnit}
						onChange={evt => modifyProduct("QuantityPerUnit", evt.target.value)}
						/>
					<TextField
						type="number"
						floatingLabelText="Unit price"
						floatingLabelFixed={true}
						fullWidth={true}
						value={this.props.selectedProduct.UnitPrice}
						onChange={evt => modifyProduct("UnitPrice", evt.target.value)}
						/>
					<Checkbox
						style={{ margin: "10px 0px" }}
						label="Discontinued"
						checked={this.props.selectedProduct.Discontinued}
						onCheck={(_, checked) => modifyProduct("Discontinued", checked)}
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