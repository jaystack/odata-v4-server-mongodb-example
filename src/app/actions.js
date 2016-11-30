import store from "./store";
import actionTypes from "./actionTypes";
import api from "./api";
import getSelectedCategoryId from "./utils/getSelectedCategoryId";
import getSelectedProductId from "./utils/getSelectedProductId";
import getCategoryModifications from "./utils/getCategoryModifications";
import getProductModifications from "./utils/getProductModifications";

export function initDb() {
  store.dispatch({ type: actionTypes.INIT_DB });
  api.post("/initDb").then(resolveInitDb, rejectInitDb);
}

function resolveInitDb() {
  store.dispatch({ type: actionTypes.RESOLVE_INIT_DB });
  getCategories();
  getProducts();
  selectCategory(null);
  selectProduct(null);
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

function getCategory(categoryId) {
  if (!categoryId)
    return;
  store.dispatch({ type: actionTypes.GET_CATEGORY, categoryId });
  api.get(`/Categories('${categoryId}')`).then(resolveGetCategory, rejectGetCategory);
}

function resolveGetCategory(category) {
  store.dispatch({ type: actionTypes.RESOLVE_GET_CATEGORY, category });
}

function rejectGetCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_GET_CATEGORY, error });
}

export function modifyCategoryFilter(filter) {
  store.dispatch({ type: actionTypes.MODIFY_CATEGORY_FILTER, filter });
}

export function filterCategories() {
  getCategories();
}

export function selectCategory(categoryId) {
  const state = store.getState();
  if (state.selectedCategory && store.getState().selectedCategory._id === categoryId)
    return;
  const category = state.categories.find(category => category._id === categoryId) || null;
  store.dispatch({ type: actionTypes.SELECT_CATEGORY, category });
  if (category)
    getCategoryProducts(category._id);
}

function getCategoryProducts(categoryId) {
  const selectedCategory = store.getState().selectedCategory;
  if (!selectedCategory || selectedCategory._id !== categoryId)
    return;
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
  api.put(`/Categories('${categoryId}')`, getCategoryModifications())
    .then(resolveSaveCategoryChanges.bind(null, categoryId), rejectSaveCategoryChanges);
}

function resolveSaveCategoryChanges(categoryId) {
  store.dispatch({ type: actionTypes.RESOLVE_SAVE_CATEGORY_CHANGES });
  getCategory(categoryId);
}

function rejectSaveCategoryChanges(error) {
  store.dispatch({ type: actionTypes.REJECT_SAVE_CATEGORY_CHANGES, error });
}

export function deleteCategory() {
  const categoryId = getSelectedCategoryId();
  store.dispatch({ type: actionTypes.DELETE_CATEGORY });
  api.delete(`/Categories('${categoryId}')`).then(resolveDeleteCategory.bind(null, categoryId), rejectDeleteCategory);
}

function resolveDeleteCategory(categoryId) {
  store.dispatch({ type: actionTypes.RESOLVE_DELETE_CATEGORY, categoryId });
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

function getProduct(productId) {
  if (!productId)
    return;
  store.dispatch({ type: actionTypes.GET_PRODUCT, productId });
  api.get(`/Products('${productId}')`).then(resolveGetProduct, rejectGetProduct);
}

function resolveGetProduct(product) {
  store.dispatch({ type: actionTypes.RESOLVE_GET_PRODUCT, product });
}

function rejectGetProduct(error) {
  store.dispatch({ type: actionTypes.REJECT_GET_PRODUCT, error });
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

export function modifyProduct(propName, propValue) {
  store.dispatch({ type: actionTypes.MODIFY_PRODUCT, propName, propValue });
}

export function discardProductModifications() {
  store.dispatch({ type: actionTypes.DISCARD_PRODUCT_MODIFICATIONS });
}

export function saveProductModifications() {
  const productId = getSelectedProductId();
  store.dispatch({ type: actionTypes.SAVE_PRODUCT_CHANGES });
  api.put(`/Products('${productId}')`, getProductModifications())
    .then(resolveSaveProductChanges.bind(null, productId), rejectSaveProductChanges);
}

function resolveSaveProductChanges(productId) {
  store.dispatch({ type: actionTypes.RESOLVE_SAVE_PRODUCT_CHANGES });
  getProduct(productId);
}

function rejectSaveProductChanges(error) {
  store.dispatch({ type: actionTypes.REJECT_SAVE_PRODUCT_CHANGES, error });
}

export function deleteProduct() {
  const productId = getSelectedProductId();
  store.dispatch({ type: actionTypes.DELETE_PRODUCT });
  api.delete(`/Products('${productId}')`).then(resolveDeleteProduct.bind(null, productId), rejectDeleteProduct);
}

function resolveDeleteProduct(productId) {
  store.dispatch({ type: actionTypes.RESOLVE_DELETE_PRODUCT, productId });
}

function rejectDeleteProduct(error) {
  store.dispatch({ type: actionTypes.REJECT_DELETE_PRODUCT, error });
}

export function setProductCategory(categoryId) {
  const product = store.getState().selectedProduct;
  if (!product)
    return;
  const productId = product._id;
  const prevCategoryId = product.CategoryId || null;
  store.dispatch({ type: actionTypes.SET_PRODUCT_CATEGORY, productId, categoryId, prevCategoryId });
  if (categoryId) {
    api.post(`/Products('${productId}')/Category/$ref`, { "@odata.id": `${window.location.href}api/Categories('${categoryId}')` })
      .then(resolveSetProductCategory.bind(null, productId, categoryId, prevCategoryId), rejectSetProductCategory);
  } else {
    api.delete(`/Products('${productId}')/Category/$ref`)
      .then(resolveSetProductCategory.bind(null, productId, categoryId, prevCategoryId), rejectSetProductCategory);
  }
}

function resolveSetProductCategory(productId, categoryId, prevCategoryId) {
  store.dispatch({ type: actionTypes.RESOLVE_SET_PRODUCT_CATEGORY, productId, categoryId });
  getProduct(productId);
  getCategoryProducts(categoryId);
  getCategoryProducts(prevCategoryId);
}

function rejectSetProductCategory(error) {
  store.dispatch({ type: actionTypes.REJECT_SET_PRODUCT_CATEGORY, error });
}