import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default function CategoryProperties(props) {
	return (
		<Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
			<CardHeader title="Properties" subtitle="Here you can set the categorys properties" />
			<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
				<TextField floatingLabelText="Name" floatingLabelFixed={true} fullWidth={true} value={props.selectedCategory.Name} />
				<TextField floatingLabelText="Description" floatingLabelFixed={true} fullWidth={true} value={props.selectedCategory.Description} />
			</CardText>
			<CardActions>
				<RaisedButton label="Save" primary={true} />
				<RaisedButton label="Discard" disabled={true} />
				<RaisedButton label="Delete" secondary={true} />
			</CardActions>
		</Card>
	);
}