import React from "react";
import AutoComplete from 'material-ui/AutoComplete';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { setProductCategory } from "../actions";

export default class AssignCategoryToProductCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: this.getSelectedCategoryName(),
			dataSource: props.categories
		};
	}

	getSelectedCategoryName() {
		const category = this.props.categories.find(category => category._id === this.props.selectedProduct.CategoryId)
		return category.Name || "";
	}

	getDataSource(value) {
		const searchText = value || this.refs.autocomplete.state.searchText;
		console.log(searchText);
		return this.props.categories
			.filter(category => new RegExp(searchText, 'i').test(category.Name));
	}

	handleUpdateInput(value) {
		this.setState({
			searchText: value,
			dataSource: this.getDataSource(value)
		});
	}

	handleNewRequest(choosen) {
		setProductCategory(choosen.value);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.categories !== this.props.categories)
			this.setState({ dataSource: this.getDataSource() });
		if (prevProps.selectedProduct !== this.props.selectedProduct)
			this.setState({ searchText: this.getSelectedCategoryName() });
	}

	render() {
		return (
			<Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
				<CardHeader
					title="Category"
					subtitle="Here you can set the category of product"
					titleStyle={{ fontSize: "20px" }} />
				<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
					<AutoComplete
						ref="autocomplete"
						floatingLabelText="Category"
						filter={AutoComplete.noFilter}
						openOnFocus={true}
						dataSource={this.state.dataSource}
						dataSourceConfig={{ text: 'Name', value: '_id' }}
						searchText={this.state.searchText}
						fullWidth={true}
						maxSearchResults={5}
						onUpdateInput={value => this.handleUpdateInput(value)}
						onNewRequest={choosen => this.handleNewRequest(choosen)}
						/>
				</CardText>
			</Card>
		);
	}

}