import Search from "./models/Search";
import * as searchView from "./views/searchViews";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/* Search controller */
const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getInput();
  if (query) {
    // 2) New Search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipe
      await state.search.getResults();

      // 5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (e) {
      console.log(e);
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * Recipe controller
 */

const controlRecipe = async () => {
  // GET ID from url
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    // prepare UI for changes

    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data and parse Ingredient
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      /// Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe
      console.log(state.recipe);
    } catch (e) {
      console.log(e);
    }
  }
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
