import React from "react";
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SearchIcon from 'material-ui/svg-icons/action/search';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
//import CreateCategoryDialog from "./CreateCategoryDialog";
import { modifyProductFilter, modifyProductOrder, filterProducts } from "../actions";

function renderListItem(product) {
	return (
		<div key={product._id}>
			<ListItem
				primaryText={product.Name}
				secondaryText={`$${product.UnitPrice}`}
				onTouchTap={() => selectProduct(product._id)}
				style={{ height: "72px" }}
				/>
			<Divider />
		</div>
	);
}

function renderList(products) {

}

class ProductList extends React.Component {

	shouldComponentUpdate(nextProps) {
		if (nextProps.products !== this.props.products)
			return true;
		return false;
	}

	render() {
		return (
			<List style={{ flex: "1 1 0", overflowY: "auto" }}>
				{this.props.products.map(renderListItem)}
			</List>
		);
	}
}

function renderSearchBar(productFilter, productOrder) {
	return (
		<Paper zDepth={1} style={{ display: "flex", padding: "10px 20px", zIndex: 1, flexDirection: "column" }}>
			<div style={{ display: "flex", flex: "0 0 auto" }}>
				<div style={{ flex: "1 1 0", paddingRight: "10px" }}>
					<TextField
						hintText="Filter ..."
						fullWidth={true}
						value={productFilter}
						onChange={evt => modifyProductFilter(evt.target.value)}
						onKeyPress={evt => { if (evt.which === 13) filterProducts() } }
						/>
				</div>
				<div style={{ display: "flex", flex: "0 0 auto", alignItems: "center" }}>
					<RaisedButton
						icon={<SearchIcon />}
						primary={true}
						onTouchTap={filterProducts}
						/>
				</div>
			</div>
			<div style={{ flex: "0 0 auto", height: "72px" }}>
				<SelectField
					floatingLabelText="Order by"
					autoWidth={true}
					value={productOrder}
					onChange={(_, __, value) => modifyProductOrder(value)}
					>
					<MenuItem value={null} primaryText="" />
					<MenuItem value="Name" primaryText="Name" />
					<MenuItem value="UnitPrice" primaryText="UnitPrice" />
				</SelectField>
			</div>
		</Paper>
	);
}

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = { isOpenProductCreateDialog: false };
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			nextProps.products !== this.props.products ||
			nextProps.productFilter !== this.props.productFilter ||
			nextProps.productOrder !== this.props.productOrder ||
			nextState.isOpenProductCreateDialog !== this.state.isOpenProductCreateDialog
		) return true;
		return false;
	}

	handleCreate() {
		this.setState({ isOpenProductCreateDialog: true });
	}

	handleCancelCreateProduct() {
		this.setState({ isOpenProductCreateDialog: false });
	}

	handleSubmitCreateProduct(product) {
		this.setState({ isOpenProductCreateDialog: false });
		//createProduct(product);
	}

	render() {
		return (
			<Paper zDepth={3} style={{ display: "flex", flexDirection: "column", flex: "0 0 auto", width: "25%", minWidth: "300px", overflow: "hidden" }}>
				{renderSearchBar(this.props.productFilter, this.props.productOrder)}
				<div style={{ position: "relative", display: "flex", flexDirection: "column", flex: "1 1 0" }}>
					<ProductList products={this.props.products} />
					<FloatingActionButton
						style={{ position: "absolute", bottom: "20px", right: "20px" }}
						onTouchTap={() => this.handleCreate()}
						>
						<ContentAdd />
					</FloatingActionButton>
					{/*<CreateCategoryDialog
            open={this.state.isOpenProductCreateDialog}
            onCancel={() => this.handleCancelCreateProduct()}
            onSubmit={product => this.handleSubmitCreateProduct(product)}
            />*/}
				</div>
			</Paper>
		);
	}

}