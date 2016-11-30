import actionTypes from "../actionTypes";
import replaceItem from "../utils/replaceItem";
import removeItem from "../utils/removeItem";

export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.RESOLVE_GET_PRODUCTS:
      return action.items;
    case actionTypes.RESOLVE_GET_PRODUCT:
      return replaceItem(state, action.product);
    case actionTypes.RESOLVE_CREATE_PRODUCT:
      return [...state, action.product];
    case actionTypes.RESOLVE_DELETE_PRODUCT:
      return removeItem(state, action.productId);
    default:
      return state;
  }
}