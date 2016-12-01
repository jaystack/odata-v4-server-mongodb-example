import actionTypes from "./../actionTypes";

export default function (state = "", action) {
	switch (action.type) {
		case actionTypes.MODIFY_CATEGORY_FILTER:
			return action.filter;
		default:
			return state;
	}
}