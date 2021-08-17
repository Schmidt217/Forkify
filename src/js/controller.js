import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import paginationView from "./views/paginationView.js";

// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();

		// Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());

		// Loading recipe
		await model.loadRecipe(id);

		// Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		// Get Search Query
		const query = searchView.getQuery();
		if (!query) return;

		// Load search results
		await model.loadSearchResults(query);
		// Render Results
		resultsView.render(model.getSearchResultsPage());

		// Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function (goToPage) {
	// Render new Results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// Render new pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);
	// Update the recipe view
	//recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};
init();
