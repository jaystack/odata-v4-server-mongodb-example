import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class CreateProductDialog extends React.Component {

	constructor(props) {
		super(props);
		this.initState();
	}

	initState() {
		this.state = {
			Name: "",
			QuantityPerUnit: "",
			UnitPrice: 0,
			Discontinued: false,
			CategoryId: null
		};
	}

	handleCancel() {
		this.props.onCancel();
		this.initState();
	}

	handleSubmit() {
		this.props.onSubmit(Object.assign({}, this.state));
		this.initState();
	}

	handleUpdate(propName, propValue) {
		this.setState({ [propName]: propValue });
	}

	isSubmitButtonDisabled() {
		if (!this.state.Name)
			return true;
		return false;
	}

	renderSelectableCategories() {
		return this.props.categories
			.map(category => (
				<MenuItem key={category._id} value={category._id} primaryText={category.Name} /> 
			));
	}

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				onTouchTap={() => this.handleCancel()}
				/>,
			<FlatButton
				label="Create"
				primary={true}
				disabled={this.isSubmitButtonDisabled()}
				onTouchTap={() => this.handleSubmit()}
				/>
		];

		return (
			<Dialog
				title="Create new category"
				actions={actions}
				open={this.props.open || false}
				>
				<TextField
					floatingLabelText="Name"
					floatingLabelFixed={true}
					fullWidth={true}
					value={this.state.Name}
					onChange={evt => this.handleUpdate("Name", evt.target.value)}
					/>
				<TextField
					floatingLabelText="Quantity per unit"
					floatingLabelFixed={true}
					fullWidth={true}
					value={this.state.QuantityPerUnit}
					onChange={evt => this.handleUpdate("QuantityPerUnit", evt.target.value)}
					/>
				<TextField
					type="number"
					floatingLabelText="Unit price"
					floatingLabelFixed={true}
					fullWidth={true}
					value={this.state.UnitPrice}
					onChange={evt => this.handleUpdate("UnitPrice", evt.target.value)}
					/>
				<Checkbox
					style={{ margin: "10px 0px" }}
					label="Discontinued"
					checked={this.state.Discontinued}
					onCheck={(_, checked) => this.handleUpdate("Discontinued", checked)}
					/>
				<SelectField
					floatingLabelText="Category"
					fullWidth={true}
					value={this.state.CategoryId}
					onChange={(_, __, value) => this.handleUpdate("CategoryId", value)}
					maxHeight={300}
					>
					<MenuItem value={null} primaryText="" />
					{this.renderSelectableCategories()}
				</SelectField>
			</Dialog>
		);
	}
}