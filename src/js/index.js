import Search from './modules/Search';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './modules/Recipe';
import List from './modules/List';
import Likes from './modules/Likes';

/*Global State of the app
 *- Search object
 *- Current recipe object
 *- Shopping list object
 *- Liked Recipes
 */
const state = {};

//Search Controller
const controlSearch = async () => {
    // 1)Get the query
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to State
        state.search = new Search(query);
        // 3)Prepare UI for Results
        searchView.clearInput();
        searchView.claerRseult();
        renderLoader(elements.searchRes);

        try {
            // 4)Search for recipes
            await state.search.getResults();

            // 5)Render results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (err) {
            alert('Something wentwrong with search');
            clearLoader();
        }

    }
}
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});
elements.searchResultPage.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.claerRseult();
        searchView.renderResult(state.search.result, goToPage);
    }
});

//Recipe Controller
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {

        try {
            //prepare UI for changes
            recipeView.clearRecipe();
            renderLoader(elements.recipe);
            //Highlight Selected text
            if (state.search) searchView.heighlightSelected(id);
            //Create new recipe object
            state.recipe = new Recipe(id);
            //Get recipe data and parseIngredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate times and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            alert(err);
        }

    }
}
window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

//List Controller
const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

//Like Controller
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    if (!state.likes.isLiked(currentId)) {
        //Add recipe to like
        const newLike = state.likes.addLikes(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add recipe to UI
        likesView.renderLike(newLike);
    } else {
        //Remove recipe to like
        state.likes.deleteLikes(currentId);
        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove recipe to UI
        likesView.deletelikeItem(currentId);
    }
}
window.addEventListener('load', () => {
    state.likes = new Likes();
    //likesView.toogleLikeMenu(state.likes.countLike());
    state.likes.readStorage();
    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
});
elements.shopping.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count--value')) {
        const val = parseFloat(event.target.value, 10);

        state.list.updateCount(id, val);
    }

});
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe);

        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);

    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (event.target.matches('.recipe__love , .recipe__love *')) {
        controlLike();
    }
});