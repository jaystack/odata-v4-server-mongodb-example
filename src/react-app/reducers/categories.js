import actionTypes from "../actionTypes";
import replaceItem from "../utils/replaceItem";
import removeItem from "../utils/removeItem";

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.RESOLVE_GET_CATEGORIES:
      return action.items;
    case actionTypes.RESOLVE_GET_CATEGORY:
      return replaceItem(state, action.category);
    case actionTypes.RESOLVE_CREATE_CATEGORY:
      return [...state, action.category];
    case actionTypes.RESOLVE_DELETE_CATEGORY:
      return removeItem(state, action.categoryId);
    default:
      return state;
  }
}