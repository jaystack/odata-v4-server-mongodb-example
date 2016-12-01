import actionTypes from "../actionTypes";
import replaceItem from "../utils/replaceItem";
import removeItem from "../utils/removeItem";

function updateProductCategory(state, productId, categoryId) {
	
  const productIndex = state.findIndex(product => product._id === productId);
  if (productIndex === -1)
    return state;
  const product = state[productIndex];

  const newProduct = Object.assign({}, product, {CategoryId: categoryId });

  if (!categoryId)
    delete newProduct.CategoryId;
  
  return [
    ...state.slice(0, productIndex),
    newProduct,
    ...state.slice(productIndex+1)
  ];
}

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
    case actionTypes.RESOLVE_SET_PRODUCT_CATEGORY:
      return updateProductCategory(state, action.productId, action.categoryId);
    case actionTypes.RESOLVE_ADD_PRODUCT_TO_CATEGORY:
      return updateProductCategory(state, action.productId, action.categoryId);
    case actionTypes.RESOLVE_DELETE_PRODUCT_FROM_CATEGORY:
      return updateProductCategory(state, action.productId, null);
    default:
      return state;
  }
}