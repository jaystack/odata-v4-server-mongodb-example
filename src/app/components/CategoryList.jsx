import React from "react";
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { selectCategory } from "../actions";

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

export default function CategoryList(props) {
	return (
		<Paper zDepth={3} style={{ display: "flex", flexDirection: "column", flex: "0 0 auto", width: "25%", minWidth: "300px", overflow: "hidden" }}>
			{renderSearchBar()}
			<div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", overflowY: "auto" }}>
				{renderList(props.categories)}
			</div>
		</Paper>
	);
}