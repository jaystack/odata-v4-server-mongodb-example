import store from "./store";
import actionTypes from "./actionTypes";
import api from "./api";

export function getCategories() {
  store.dispatch({type: actionTypes.GET_CATEGORIES});
	api.get("/Categories").then(resolveGetCategories, rejectGetCategories);
}

function resolveGetCategories(items) {
  store.dispatch({type: actionTypes.RESOLVE_GET_CATEGORIES, items});
}

function rejectGetCategories(error) {
  store.dispatch({type: actionTypes.REJECT_GET_CATEGORIES, error});
}

export function getProducts() {
  store.dispatch({type: actionTypes.GET_PRODUCTS});
	api.get("/Products").then(resolveGetProducts, rejectGetProducts);
}

function resolveGetProducts(items) {
  store.dispatch({type: actionTypes.RESOLVE_GET_PRODUCTS, items});
}

function rejectGetProducts(error) {
  store.dispatch({type: actionTypes.REJECT_GET_PRODUCTS, error});
}

export function selectCategory(category) {
  if (store.getState().selectedCategory && store.getState().selectedCategory._id === category._id)
    return;
  store.dispatch({type: actionTypes.SELECT_CATEGORY, category});
  getCategoryProducts(category._id);
}

function getCategoryProducts(categoryId) {
  store.dispatch({type: actionTypes.GET_CATEGORY_PRODUCTS, categoryId});
  api.get(`/Categories('${categoryId}')/Products`)
    .then(resolveGetCategoryProducts.bind(null, categoryId), rejectGetCategoryProducts);
}

function resolveGetCategoryProducts(categoryId, items) {
  store.dispatch({type: actionTypes.RESOLVE_GET_CATEGORY_PRODUCTS, categoryId, items});
}

function rejectGetCategoryProducts(error) {
  store.dispatch({type: actionTypes.REJECT_GET_CATEGORY_PRODUCTS, error});
}

export function addProductToCategory(categoryId, productId) {
  store.dispatch({type: actionTypes.ADD_PRODUCT_TO_CATEGORY, categoryId, productId});
  api.post(`/Categories('${categoryId}')/Products/$ref`, {"@odata.id": `${window.location.href}api/Products('${productId}')`})
    .then(resolveAddProductToCategory.bind(null, categoryId), rejectAddProductToCategory);
}

function resolveAddProductToCategory(categoryId) {
  store.dispatch({type: actionTypes.RESOLVE_ADD_PRODUCT_TO_CATEGORY, categoryId});
  getCategoryProducts(categoryId);
}

function rejectAddProductToCategory(error) {
  store.dispatch({type: actionTypes.REJECT_ADD_PRODUCT_TO_CATEGORY, error});
}

export function deleteProductFromCategory(categoryId, productId) {
  store.dispatch({type: actionTypes.DELETE_PRODUCT_FROM_CATEGORY, categoryId, productId});
  api.delete(`/Categories('${categoryId}')/Products/$ref?$id=${window.location.href}api/Products('${productId}')`)
    .then(resolveDeleteProductFromCategory.bind(null, categoryId), rejectDeleteProductFromCategory);
}

function resolveDeleteProductFromCategory(categoryId) {
  store.dispatch({type: actionTypes.RESOLVE_DELETE_PRODUCT_FROM_CATEGORY, categoryId});
  getCategoryProducts(categoryId);
}

function rejectDeleteProductFromCategory(error) {
  store.dispatch({type: actionTypes.REJECT_DELETE_PRODUCT_FROM_CATEGORY, error});
}