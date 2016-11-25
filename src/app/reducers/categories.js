import actionTypes from "./../actionTypes";

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.RESOLVE_GET_CATEGORIES:
      return action.items;
    default:
      return state;
  }
}