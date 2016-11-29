import React from "react";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { modifyCategory, discardCategoryModifications, saveCategoryModifications, deleteCategory } from "../actions";
import areChanges from "../utils/areCategoryChanges";
import ConfirmDialog from "./ConfirmDialog";

export default class CategoryProperties extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpenConfirmDialog: false };
  }

  handleDelete() {
    this.setState({ isOpenConfirmDialog: true });
  }

  handleCancelDeleting() {
    this.setState({ isOpenConfirmDialog: false });
  }

  handleSubmitDeleting() {
    this.setState({ isOpenConfirmDialog: false });
    deleteCategory();
  }

  render() {
    return (
      <Card style={{ flex: "1 1 0", margin: "20px 5px 20px 20px", minWidth: "400px" }}>
        <CardHeader title="Properties" subtitle="Here you can set the categorys properties" />
        <CardText style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
          <TextField
            floatingLabelText="Name"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.props.selectedCategory.Name}
            onChange={evt => modifyCategory("Name", evt.target.value)}
            />
          <TextField
            floatingLabelText="Description"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.props.selectedCategory.Description}
            onChange={evt => modifyCategory("Description", evt.target.value)}
            />
        </CardText>
        <CardActions>
          <RaisedButton label="Save" primary={true} disabled={!areChanges()} onTouchTap={saveCategoryModifications} />
          <RaisedButton label="Discard" disabled={!areChanges()} onTouchTap={discardCategoryModifications} />
          <RaisedButton label="Delete" secondary={true} disabled={this.state.isOpenConfirmDialog} onTouchTap={() => this.handleDelete()} />
          <ConfirmDialog
            open={this.state.isOpenConfirmDialog}
            text={`Are your sure you want to delete this category: ${this.props.selectedCategory.Name} ?`}
            handleCancel={() => this.handleCancelDeleting()}
            handleSubmit={() => this.handleSubmitDeleting()}
            />
        </CardActions>
      </Card>
    );
  }

}