import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Categories from "./Categories";
import {getCategories, getProducts} from "../actions";

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
						style={{flex: "0 0 auto"}}
						title="Northwind"
						showMenuIconButton={false}
						/>
					<Tabs
						style={{display: "flex", flexGrow: 1, flexDirection: "column"}}
						contentContainerStyle={{display: "flex", flexGrow: 1}}
						tabTemplateStyle={{display: "flex", flexGrow: 1}}
						tabItemContainerStyle={{flex: "0 0 auto"}}
						>
						<Tab label="Categories">
							<Categories
								categories={this.props.state.categories}
								products={this.props.state.products}
								selectedCategory={this.props.state.selectedCategory}
								/>
						</Tab>
						<Tab label="Products">

						</Tab>
					</Tabs>
				</div>
			</MuiThemeProvider>
		)
	}
}