import React from "react";
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CreateCategoryDialog from "./CreateCategoryDialog";
import { modifyCategoryFilter, selectCategory, createCategory, filterCategories } from "../actions";

function renderListItem(category) {
  return (
    <div key={category._id}>
      <ListItem
        primaryText={category.Name}
        secondaryText={category.Description}
        onTouchTap={() => selectCategory(category._id)}
        style={{ height: "72px" }}
        />
      <Divider />
    </div>
  );
}

function renderList(categories) {
  return (
    <List style={{ flex: "1 1 0", overflowY: "auto" }}>
      {categories.map(renderListItem)}
    </List>
  );
}

function renderSearchBar(categoryFilter) {
  return (
    <Paper zDepth={1} style={{ display: "flex", padding: "10px 20px", zIndex: 1 }}>
      <div style={{ flex: "1 1 0", paddingRight: "10px" }}>
        <TextField
        hintText="Filter ..."
        fullWidth={true}
        value={categoryFilter}
        onChange={evt => modifyCategoryFilter(evt.target.value)}
        onKeyPress={evt => {if (evt.which === 13) filterCategories()}}
        />
      </div>
      <div style={{ display: "flex", flex: "0 0 auto", alignItems: "center" }}>
        <RaisedButton
          icon={<SearchIcon />}
          primary={true}
          onTouchTap={filterCategories}
          />
      </div>
    </Paper>
  );
}

export default class CategoryList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpenCategoryCreateDialog: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.categories !== this.props.categories ||
      nextProps.categoryFilter !== this.props.categoryFilter ||
      nextState.isOpenCategoryCreateDialog !== this.state.isOpenCategoryCreateDialog
    ) return true;
    return false;
  }

  handleCreate() {
    this.setState({ isOpenCategoryCreateDialog: true });
  }

  handleCancelCreateCategory() {
    this.setState({ isOpenCategoryCreateDialog: false });
  }

  handleSubmitCreateCategory(category) {
    this.setState({ isOpenCategoryCreateDialog: false });
    createCategory(category);
  }

  render() {
    return (
      <Paper zDepth={3} style={{ display: "flex", flexDirection: "column", flex: "0 0 auto", width: "25%", minWidth: "300px", overflow: "hidden" }}>
        {renderSearchBar(this.props.categoryFilter)}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: "1 1 0" }}>
          {renderList(this.props.categories)}
          <FloatingActionButton
            style={{ position: "absolute", bottom: "20px", right: "20px" }}
            onTouchTap={() => this.handleCreate()}
            >
            <ContentAdd />
          </FloatingActionButton>
          <CreateCategoryDialog
            open={this.state.isOpenCategoryCreateDialog}
            onCancel={() => this.handleCancelCreateCategory()}
            onSubmit={category => this.handleSubmitCreateCategory(category)}
            />
        </div>
      </Paper>
    );
  }

}