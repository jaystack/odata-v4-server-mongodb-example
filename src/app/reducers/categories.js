import actionTypes from "./../actionTypes";

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.RESOLVE_GET_CATEGORIES:
      return action.items;
    case actionTypes.RESOLVE_CREATE_CATEGORY:
      return [...state, action.category];
    default:
      return state;
  }
}