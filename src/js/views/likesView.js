import {
    elements
} from './base';

export const toggleLikeBtn = (isLiked) => {
    let iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};
/*
export const toogleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};
*/
export const renderLike = like => {
    const markup = `
    <li>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.publisher}</p>
        </div>
    </a>
</li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};
export const deletelikeItem = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    el.parentElement.removeChild(el);
}