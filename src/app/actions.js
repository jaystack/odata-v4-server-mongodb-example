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