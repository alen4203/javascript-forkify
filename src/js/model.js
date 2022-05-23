import 'regenerator-runtime/runtime'; // polifilling async await
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  cart: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};
/**
 * Fetch recipe with specific id from the API and set state.recipe to it.
 * @param {Number} id Recipe id to load
 */
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    if (state.cart.some(c => c.id === id)) state.recipe.addedToCart = true;
    else {
      state.recipe.addedToCart = false;
      state.recipe.ingredients.forEach(ing => (ing.checked = false));
    }
  } catch (error) {
    console.error(`${error} 💥️💥️💥️`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    if (data.results === 0) throw new Error('No results...');

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 💥️💥️💥️`);
    throw error;
  }
};
/**
 * Calculate the range of search results to render for a specific page number.
 * @param {Number} page The page number to render.
 * @returns {[]} Array of the search results to render.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // New ing quantity = old ing quantity * new servings / old servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Push recipe into bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  const storageCart = localStorage.getItem('cart');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  if (storageCart) state.cart = JSON.parse(storageCart);
};
init();

const clearBookmarksStorage = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarksStorage();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please follow the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const persistCart = function () {
  localStorage.setItem('cart', JSON.stringify(state.cart));
};

export const addToCart = function (recipe) {
  // Add recipe to cart
  state.cart.push(recipe);
  if (state.recipe.id === recipe.id) state.recipe.addedToCart = true;

  persistCart();
};

export const removeFromCart = function (id) {
  const index = state.cart.findIndex(rec => rec.id === id);
  // Reset all the ingredients' 'checked' status
  state.cart[index].ingredients.forEach(ing => (ing.checked = false));
  // Remove recipe from cart
  state.cart.splice(index, 1);

  if (state.recipe.id === id) state.recipe.addedToCart = false;

  persistCart();
};

export const checkIngredient = function (ingDescription, ofRecipe) {
  const recipe = state.cart.find(rec => rec.id === ofRecipe);
  // Find the ingredient being checked from the recipe
  const ingredient = recipe.ingredients.find(
    ing => ing.description === ingDescription
  );

  // Change the ingredients' 'checked' status
  ingredient.checked = ingredient.checked ? false : true;

  persistCart();
};
