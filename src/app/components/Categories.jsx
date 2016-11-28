import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import AddIcon from 'material-ui/svg-icons/content/add';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { selectCategory, addProductToCategory, deleteProductFromCategory } from "../actions";

function renderListItem(category) {
	return (
		<div key={category._id}>
			<ListItem
				primaryText={category.Name}
				secondaryText={category.Description}
				onClick={() => selectCategory(category)}
				/>
			<Divider />
		</div>
	);
}

function renderList(categories) {
	return (
		<List style={{ flex: "1 1 0" }}>
			{categories.map(renderListItem)}
		</List>
	);
}

function renderSearchBar() {
	return (
		<Paper zDepth={1} style={{ display: "flex", padding: "10px 20px", zIndex: 1 }}>
			<div style={{ flex: "1 1 0", paddingRight: "10px" }}>
				<TextField hintText="Filter ..." fullWidth={true} />
			</div>
			<div style={{ display: "flex", flex: "0 0 auto", alignItems: "center" }}>
				<RaisedButton icon={<SearchIcon />} primary={true} />
			</div>
		</Paper>
	);
}

function renderLeftBar(categories) {
	return (
		<Paper zDepth={3} style={{ display: "flex", flexDirection: "column", flex: "0 0 auto", width: "25%", minWidth: "300px", overflow: "hidden" }}>
			{renderSearchBar()}
			<div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", overflowY: "auto" }}>
				{renderList(categories)}
			</div>
		</Paper>
	);
}

function renderPropertiesCard(selectedCategory) {
	return (
		<Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
			<CardHeader title="Properties" subtitle="Here you can set the categorys properties" />
			<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
				<TextField floatingLabelText="Name" floatingLabelFixed={true} fullWidth={true} value={selectedCategory.Name} />
				<TextField floatingLabelText="Description" floatingLabelFixed={true} fullWidth={true} value={selectedCategory.Description} />
			</CardText>
			<CardActions>
				<RaisedButton label="Save" primary={true} />
				<RaisedButton label="Discard" disabled={true} />
				<RaisedButton label="Delete" secondary={true} />
			</CardActions>
		</Card>
	);
}

function renderProductClearButton(categoryId, productId) {
	return (
		<IconButton onClick={() => deleteProductFromCategory(categoryId, productId)}>
			<ClearIcon />
		</IconButton>
	);
}

function renderProduct(categoryId, product) {
	return (
		<div key={product._id}>
			<ListItem
				primaryText={product.Name}
				rightIconButton={renderProductClearButton(categoryId, product._id)}
				/>
			<Divider />
		</div>
	);
}

class AddProductCard extends React.Component {

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

function renderProducts(categoryId, products = [], selectableProducts) {
	return (
		<Card style={{ flex: "2 1 0", margin: "20px" }}>
			<CardHeader title="Products" subtitle="Here are listed the assigned products" />
			<CardText>
				<AddProductCard selectableProducts={selectableProducts} categoryId={categoryId} />
				{
					products.length > 0 ? <List>
						{products.map(renderProduct.bind(null, categoryId))}
					</List> : null
				}
			</CardText>
		</Card>
	);
}

function renderRightContent(selectedCategory, selectableProducts) {
	return selectedCategory ? (
		<div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start", overflowY: "auto" }}>
			{renderPropertiesCard(selectedCategory)}
			{renderProducts(selectedCategory._id, selectedCategory.products, selectableProducts)}
		</div>
	) : null;
}

function getSelectableProducts(assignedProducts, allProducts) {
	return allProducts
		.filter(product => !assignedProducts.map(p => p._id).includes(product._id))
		.map(product => ({ value: product._id, text: product.Name }));
}

function Categories(props) {

	const selectedCategory = props.selectedCategory;
	const selectableProducts = getSelectableProducts(selectedCategory ? selectedCategory.products || [] : [], props.products || []);

	return (
		<div style={{
			display: "flex",
			flexGrow: 1
		}}>
			{renderLeftBar(props.categories)}
			{renderRightContent(selectedCategory, selectableProducts)}
		</div>
	);
}

export default muiThemeable()(Categories);