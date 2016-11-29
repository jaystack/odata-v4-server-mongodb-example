import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { modifyCategory, discardCategoryModifications, saveCategoryModifications } from "../actions";
import areChanges from "../utils/areCategoryChanges";

export default function CategoryProperties({selectedCategory}) {
	return (
		<Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
			<CardHeader title="Properties" subtitle="Here you can set the categorys properties" />
			<CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
				<TextField
					floatingLabelText="Name"
					floatingLabelFixed={true}
					fullWidth={true}
					value={selectedCategory.Name}
					onChange={evt => modifyCategory("Name", evt.target.value)}
					/>
				<TextField
					floatingLabelText="Description"
					floatingLabelFixed={true}
					fullWidth={true}
					value={selectedCategory.Description}
					onChange={evt => modifyCategory("Description", evt.target.value)}
					/>
			</CardText>
			<CardActions>
				<RaisedButton label="Save" primary={true} disabled={!areChanges()} onClick={saveCategoryModifications} />
				<RaisedButton label="Discard" disabled={!areChanges()} onClick={discardCategoryModifications} />
				<RaisedButton label="Delete" secondary={true} />
			</CardActions>
		</Card>
	);
}