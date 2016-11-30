import store from "./store";
import actionTypes from "./actionTypes";
import api from "./api";
import getSelectedCategoryId from "./utils/getSelectedCategoryId";
import getModifications from "./utils/getModifications";

export function initDb() {
  store.dispatch({ type: actionTypes.INIT_DB });
  api.post("/initDb").then(resolveInitDb, rejectInitDb);
}

function resolveInitDb() {
  store.dispatch({ type: actionTypes.RESOLVE_INIT_DB });
  getCategories();
  getProducts();
  selectCategory(null);
}

function rejectInitDb(error) {
  store.dispatch({ type: actionTypes.REJECT_INIT_DB });
}

// Categories

export function getCategories() {
  const params = {};
  const categoryFilter = store.getState().categoryFilter;
  if (categoryFilter)
    params.$filter = `contains(Name, '${categoryFilter}')`;
  store.dispatch({ type: actionTypes.GET_CATEGORIES });
  api.get("/Categories", params).then(resolveGetCategories, rejectGetCategories);
}

function resolveGetCategories(items) {
  store.dispatch({ type: actionTypes.RESOLVE_GET_CATEGORIES, items });
}

function rejectGetCategories(error) {
  store.dispatch({ type: actionTypes.REJECT_GET_CATEGORIES, error });
}

export function modifyCategoryFilter(filter) {
  store.dispatch({ type: actionTypes.MODIFY_CATEGORY_FILTER, filter });
}

export function filterCategories() {
  getCategories();
}

export function selectCategory(categoryId) {
  const state = store.getState();
  if (state.selectedProduct && store.getState().selectedProduct._id === categoryId)
    return;
  const category = state.categories.find(category => category._id === categoryId) || null;
  store.dispatch({ type: actionTypes.SELECT_CATEGORY, category });
  getCategoryProducts(category._id);
}

function getCategoryProducts(categoryId) {
  store.dispatch({ type: actionTypes.GET_CATEGORY_PRODUCTS, categoryId });
  api.get(`/Categories('${categoryId}')/Products`)
    .then(resolveGetCategoryProducts.bind(null, categoryId), rejectGetCategoryProducts);
}

function resolveGetCategoryProducts(categoryId, items) {
  store.dispatch({ type: actionTypes.RESOLVE_GET_CATEGORY_PRODUCTS, categoryId, items });
}

function rejectGetCategoryProducts(error) {
  store.dispatch({ type: actionTypes.REJECT_GET_CATEGORY_PRODUCTS, error });
}

export function addProductToCategory(productId) {
  const categoryId = getSelectedCategoryId();
  store.dispatch({ type: actionTypes.ADD_PRODUCT_TO_CATEGORY, categoryId, productId });
  api.post(`/Categories('${categoryId}')/Products/$ref`, { "@odata.id": `${window.location.href}api/Products('${productId}')` })
    .then(resolveAddProductToCategory.bind(null, categoryId), rejectAddProductToCategory);
}

function resolveAddProductToCategory(categoryId) {
  store.dispatch({ type: actionTypes.RESOLVE_ADD_PRODUCT_TO_CATEGORY, categoryId });
  getCategoryProducts(categoryId);
}

function rejectAddProductToCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_ADD_PRODUCT_TO_CATEGORY, error });
}

export function deleteProductFromCategory(productId) {
  const categoryId = getSelectedCategoryId();
  store.dispatch({ type: actionTypes.DELETE_PRODUCT_FROM_CATEGORY, categoryId, productId });
  api.delete(`/Categories('${categoryId}')/Products/$ref?$id=${window.location.href}api/Products('${productId}')`)
    .then(resolveDeleteProductFromCategory.bind(null, categoryId), rejectDeleteProductFromCategory);
}

function resolveDeleteProductFromCategory(categoryId) {
  store.dispatch({ type: actionTypes.RESOLVE_DELETE_PRODUCT_FROM_CATEGORY, categoryId });
  getCategoryProducts(categoryId);
}

function rejectDeleteProductFromCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_DELETE_PRODUCT_FROM_CATEGORY, error });
}

export function modifyCategory(propName, propValue) {
  store.dispatch({ type: actionTypes.MODIFY_CATEGORY, propName, propValue });
}

export function discardCategoryModifications() {
  store.dispatch({ type: actionTypes.DISCARD_CATEGORY_MODIFICATIONS });
}

export function saveCategoryModifications() {
  const categoryId = getSelectedCategoryId();
  store.dispatch({ type: actionTypes.SAVE_CATEGORY_CHANGES });
  api.put(`/Categories('${categoryId}')`, getModifications()).then(resolveSaveCategoryChanges, rejectSaveCategoryChanges);
}

function resolveSaveCategoryChanges() {
  store.dispatch({ type: actionTypes.RESOLVE_SAVE_CATEGORY_CHANGES });
  getCategories();
}

function rejectSaveCategoryChanges(error) {
  store.dispatch({ type: actionTypes.REJECT_SAVE_CATEGORY_CHANGES, error });
}

export function deleteCategory() {
  const categoryId = getSelectedCategoryId();
  store.dispatch({ type: actionTypes.DELETE_CATEGORY });
  api.delete(`/Categories('${categoryId}')`).then(resolveDeleteCategory, rejectDeleteCategory);
}

function resolveDeleteCategory() {
  store.dispatch({ type: actionTypes.RESOLVE_DELETE_CATEGORY });
  getCategories();
}

function rejectDeleteCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_DELETE_CATEGORY, error });
}

export function createCategory(category) {
  store.dispatch({ type: actionTypes.CREATE_CATEGORY, category });
  api.post("/Categories", category).then(resolveCreateCategory, rejectCreateCategory);
}

function resolveCreateCategory(category) {
  store.dispatch({ type: actionTypes.RESOLVE_CREATE_CATEGORY, category });
  selectCategory(category._id);
}

function rejectCreateCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_CREATE_CATEGORY });
}

// Products

export function getProducts() {
  const params = {};
  const state = store.getState();
  const productFilter = state.productFilter;
  const productOrder = state.productOrder;
  if (productFilter)
    params.$filter = `contains(Name, '${productFilter}')`;
  if (productOrder)
    params.$orderby = productOrder;

  store.dispatch({ type: actionTypes.GET_PRODUCTS });
  api.get("/Products", params).then(resolveGetProducts, rejectGetProducts);
}

function resolveGetProducts(items) {
  store.dispatch({ type: actionTypes.RESOLVE_GET_PRODUCTS, items });
}

function rejectGetProducts(error) {
  store.dispatch({ type: actionTypes.REJECT_GET_PRODUCTS, error });
}

export function modifyProductOrder(order) {
  store.dispatch({ type: actionTypes.MODIFY_PRODUCT_ORDER, order });
  getProducts();
}

export function modifyProductFilter(filter) {
  store.dispatch({ type: actionTypes.MODIFY_PRODUCT_FILTER, filter });
}

export function filterProducts() {
  getProducts();
}

export function selectProduct(productId) {
  const state = store.getState();
  if (state.selectedProduct && store.getState().selectedProduct._id === productId)
    return;
  const product = state.products.find(product => product._id === productId) || null;
  store.dispatch({ type: actionTypes.SELECT_PRODUCT, product });
}