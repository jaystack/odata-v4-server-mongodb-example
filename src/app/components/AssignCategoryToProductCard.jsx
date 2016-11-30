import React from "react";
//import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { setProductCategory } from "../actions";

export default class AssignCategoryToProductCard extends React.Component {

	renderMenuItems() {
		return this.props.categories
			.map(category => (
				<MenuItem key={category._id} value={category._id} primaryText={category.Name} /> 
			));
	}

	render() {
		return (
			<Card style={{ flex: "2 1 0", margin: "20px" }}>
				<CardHeader
					title="Category"
					subtitle="Here you can set the category of product"
					titleStyle={{ fontSize: "20px" }} />
				<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
					<SelectField
						floatingLabelText="Category"
						fullWidth={true}
						value={this.props.categoryId}
						onChange={(_, __, value) => setProductCategory(value)}
						maxHeight={300}
						>
						<MenuItem value={null} primaryText="" />
						{this.renderMenuItems()}
					</SelectField>
				</CardText>
			</Card>
		);
	}

}