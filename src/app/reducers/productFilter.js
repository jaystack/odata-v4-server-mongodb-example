import actionTypes from "./../actionTypes";

export default function (state = "", action) {
	switch (action.type) {
		case actionTypes.MODIFY_PRODUCT_FILTER:
			return action.filter;
		default:
			return state;
	}
}