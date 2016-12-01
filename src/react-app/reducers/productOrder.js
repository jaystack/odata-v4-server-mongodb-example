import actionTypes from "./../actionTypes";

export default function (state = null, action) {
	switch (action.type) {
    case actionTypes.MODIFY_PRODUCT_ORDER:
      return action.order;
    default:
      return state;
  }
}