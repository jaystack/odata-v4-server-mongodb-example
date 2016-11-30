import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import CategoriesPage from "./CategoriesPage";
import ProductsPage from "./ProductsPage";
import { getCategories, getProducts, initDb } from "../actions";

export default class Demo extends React.Component {

	componentDidMount() {
		getCategories();
		getProducts();
	}

	render() {
		return (
			<MuiThemeProvider>
				<div style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					overflow: "hidden"
				}}>
					<AppBar
						style={{ flex: "0 0 auto" }}
						title="Northwind"
						showMenuIconButton={false}
						iconElementRight={<FlatButton label="Init DB" onTouchTap={initDb} />}
						/>
					<Tabs
						style={{ display: "flex", flexGrow: 1, flexDirection: "column" }}
						contentContainerStyle={{ flexGrow: 1, position: "relative" }}
						tabTemplateStyle={{ display: "flex", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
						tabItemContainerStyle={{ flex: "0 0 auto" }}
						>
						<Tab label="Categories">
							<CategoriesPage
								categories={this.props.state.categories}
								products={this.props.state.products}
								categoryFilter={this.props.state.categoryFilter}
								selectedCategory={this.props.state.selectedCategory}
								/>
						</Tab>
						<Tab label="Products">
							<ProductsPage
								products={this.props.state.products}
								productFilter={this.props.state.productFilter}
								productOrder={this.props.state.productOrder}
								selectedProduct={this.props.state.selectedProduct}
								/>
						</Tab>
					</Tabs>
				</div>
			</MuiThemeProvider>
		)
	}
}