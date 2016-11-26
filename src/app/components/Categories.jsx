import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import muiThemeable from 'material-ui/styles/muiThemeable';

function renderListItem(category) {
	return (
		<div>
			<ListItem key={category._id} primaryText={category.Name} secondaryText={category.Description} />
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

function renderPropertiesCard() {
	return (
		<Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
			<CardHeader title="Properties"/>
			<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
				<TextField floatingLabelText="Name" floatingLabelFixed={true} fullWidth={true} value="Beverages" />
				<TextField floatingLabelText="Description" floatingLabelFixed={true} fullWidth={true} value="Soft drinks" />
			</CardText>
			<CardActions>
				<RaisedButton label="Save" primary={true} />
				<RaisedButton label="Discard" disabled={true} />
				<RaisedButton label="Delete" secondary={true} />
			</CardActions>
		</Card>
	);
}

function renderProducts(products = []) {
	return (
		<Card style={{ flex: "2 1 0", margin: "20px" }}>
			<CardHeader title="Products"/>
			{products.length === 0 ?
				<CardText color="#AAA" style={{display: "flex", justifyContent: "center"}}>No products</CardText> :
				<CardText>...</CardText>
			}
		</Card>
	);
}

function renderRightContent() {
	return (
		<div style={{ display: "flex", flex: "1 1 0", alignItems: "flex-start" }}>
			{renderPropertiesCard()}
			{renderProducts()}
		</div>
	);
}

function Categories(props) {
	return (
		<div style={{
			display: "flex",
			flexGrow: 1
		}}>
			{renderLeftBar(props.categories)}
			{renderRightContent()}
		</div>
	);
}

export default muiThemeable()(Categories);