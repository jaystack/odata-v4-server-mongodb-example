import React from "react";
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import { addProductToCategory } from "../actions";

export default class AssignProductToCategoryCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			dataSource: props.selectableProducts
		};
	}

	handleUpdateInput(value) {
		this.setState({
			searchText: value,
			dataSource: this.props.selectableProducts
				.filter(product => new RegExp(value, 'i').test(product.text))
		});
	}

	handleNewRequest(choosen) {
		addProductToCategory(this.props.categoryId, choosen.value);
		this.setState({
			searchText: ""
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.selectableProducts !== this.props.selectableProducts)
			this.handleUpdateInput(this.refs.autocomplete.state.searchText);
	}

	render() {
		return (
			<Paper zDepth={1} style={{ display: "flex", padding: "10px 20px", zIndex: 1 }}>
				<AutoComplete
					ref="autocomplete"
					floatingLabelText="Assign new product"
					floatingLabelFixed={true}
					filter={AutoComplete.noFilter}
					openOnFocus={true}
					dataSource={this.state.dataSource}
					searchText={this.state.searchText}
					fullWidth={true}
					maxSearchResults={5}
					onUpdateInput={value => this.handleUpdateInput(value)}
					onNewRequest={choosen => this.handleNewRequest(choosen)}
					/>
			</Paper>
		);
	}

}