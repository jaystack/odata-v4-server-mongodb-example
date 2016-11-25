import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Categories extends React.Component {

	renderList() {
		return this.props.categories.map(category => (
			<Card style={{
				marginBottom: "10px"
			}}>
				<CardHeader title={category.Name} titleStyle={{ fontSize: "20px" }} />
				<CardText color="#AAA">
					{category.Description}
				</CardText>
			</Card>
		));
	}

	render() {
		return (
			<div style={{
				display: "flex",
				flexDirection: "column",
				flexGrow: 1,
				overflowY: "auto",
				padding: "20px 30% 20px 30%"
			}}>
				{this.renderList()}
			</div>
				);
	}
}

export default muiThemeable()(Categories);