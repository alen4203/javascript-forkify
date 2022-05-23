import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polifilling others
import 'regenerator-runtime/runtime'; // polifilling async await
import cartView from './views/cartView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 0) Update results / bookmarks page to highlight the selected result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    // remember async function returns a promise
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Get search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(`${error}, rendering error message...`);
    resultsView.renderErrorMessage();
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Render updated recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // 2) Update recipe view for bookmark
  recipeView.update(model.state.recipe);

  // 3) Render bookmark
  if (model.state.bookmarks.length === 0) bookmarksView.renderErrorMessage();
  else bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  if (model.state.bookmarks.length > 0)
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();
    // Upload recipe (async function returns a promise!!)
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Update resultsView &  render bookmarks
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks);

    // Close modal window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    // console.error(`~~~!!!${error}`);
    addRecipeView.renderErrorMessage(error);
  }
};

const controlAddToCart = function () {
  // Add / Remove recipe to / from cart
  if (!model.state.recipe.addedToCart) model.addToCart(model.state.recipe);
  else model.removeFromCart(model.state.recipe.id);

  // Update the addToCart btn style
  recipeView.update(model.state.recipe);

  // Re-render cartView
  if (model.state.cart.length === 0) cartView.renderErrorMessage();
  else cartView.render(model.state.cart);
};

const controlCart = function () {
  if (model.state.cart.length > 0) cartView.render(model.state.cart);
};

const controlCheckIngredient = function (ingDescription, ofRecipe) {
  model.checkIngredient(ingDescription, ofRecipe);
  cartView.update(model.state.cart);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  cartView.addHandlerRender(controlCart);
  cartView.addHandlerCheckIngredient(controlCheckIngredient);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddToCart(controlAddToCart);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerSubmitRecipe(controlAddRecipe);
};
init();
