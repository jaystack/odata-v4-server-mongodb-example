import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class CreateCategoryDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			Name: "",
			Description: ""
		};
	}

	handleSubmit() {
		this.props.onSubmit(Object.assign({}, this.state));
	}

	handleUpdate(propName, propValue) {
		this.setState({ [propName]: propValue });
	}

	isSubmitButtonDisabled() {
		if (!this.state.Name)
			return true;
		return false;
	}

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={() => this.props.onCancel}
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
					floatingLabelText="Description"
					floatingLabelFixed={true}
					fullWidth={true}
					value={this.state.Description}
					onChange={evt => this.handleUpdate("Description", evt.target.value)}
					/>
			</Dialog>
		);
	}
}