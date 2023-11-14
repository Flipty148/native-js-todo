import { arrayToString } from "./helpers.js";


function fragment(strings, ...values) {
    const str = strings.reduce( (buffer, string, i) => buffer +  string + (values[i] ?? ''), '' ); // Формирование строки для построения
    const template = document.createElement('template');
    template.innerHTML = str;
    return template.content;
}

/**
 * Функция для отрисовки ошибки при отсутствии запрашиваемого контента
 */ 
export function renderNotFound() {
    return fragment/*html*/`
        <h1>Page not found</h1>
    `;
}

/**
 * Отрисовка списка фильмов
 * @param {Film[]} filmsList 
 * @returns 
 */
export function renderFilmsList(filmsList) {
    const page = fragment/*html*/`
    <div class="films-list">
        <h1 class="page-title">Films list</h1>
        <div class="films__list list">
            ${filmsList.length === 0 
                ? /*html*/`<h5 class="no-films">No films yet.</h5>` 
                : getFilmCardTemplate(filmsList)}
        </div>
    </div>
    `;
    return page;
}

/**
 * Отрисовка карточек фильмов
 * @param {Film[]} filmList
 */
function getFilmCardTemplate(filmsList) {
    return filmsList.map(film => {
        return /*html*/`
            <div class="list__item card film" data-id="${film.id}">
                <div class="card-header film-header ${film.watch ? 'film-header__watch' : ''}">
                    <h5 class="card-title">${film.title}</h5>
                    <div class="card-icon film-status-icon">${film.watch ? 'wathcedIcon' : 'unwatchedIcon'}</div>
                </div>
                <div class="card-content">
                    <div class="film-description">${film.description}</div>
                    <div class="film-genres">${arrayToString(film.genres)}</div>
                    <div class="film-status">${film.watch ? 'whatched' : 'unwatched'}</div>
                </div>
            </div>   
        `;
    }).join('');
}

