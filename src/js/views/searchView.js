import {
    elements
} from './base';

export const getInput = () => elements.searchItem.value;

export const clearInput = () => {
    elements.searchItem.value = '';
};
export const claerRseult = () => {
    elements.searchRseultList.innerHTML = '';
    elements.searchResultPage.innerHTML = '';
};
const reduceTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};
export const heighlightSelected = id => {
    const arr = Array.from(document.querySelectorAll('.results__link'));
    arr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
         <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${reduceTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
         </a>
    </li>
    `;
    elements.searchRseultList.insertAdjacentHTML('beforeend', markup);
};
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page -1 : page + 1}>
        <span>Page ${type == 'prev' ? page -1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
        </svg>
        </button>    
`;
const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page == 1 && pages > 1) {
        // Display next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Display both option
        button = `${createButton(page, 'prev')}
                ${createButton(page,'next')}        
        `;
    } else if (page == pages && pages > 1) {
        // Display prev page
        button = createButton(page, 'prev');
    }
    elements.searchResultPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    //render Result of currrent page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination createButton
    renderButton(page, recipes.length, resPerPage);
}