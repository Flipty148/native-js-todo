import { dispatchToggleFilmStatus } from "./events.js";
import { arrayToString } from "./helpers.js";
import { eyeIcon, eyeOffIcon } from "./icons.js";


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
        <h1 class="page-title">Страница не найдена</h1>
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
        <h1 class="page-title">Список фильмов для просмотра</h1>
        <div class="films__list card-list">
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
            <div class="list__item card film" data-id="${film.id}" onclick="${dispatchToggleFilmStatus(film.id)}">
                <div class="card-header film-header ${film.watch ? 'film-header__watch' : ''}" >
                    <h5 class="card-title">${film.title}</h5>
                    <div class="card-icon film-status-icon">${film.watch ? eyeOffIcon() : eyeIcon()}</div>
                </div>
                <div class="card-content">
                    <div class="film-description"><span class="card-point-name">Описание:</span> ${film.description} </div>
                    <div class="film-genres"><span class="card-point-name">Жанры:</span> ${arrayToString(film.genres)}</div>
                    <div class="film-status"><span class="card-point-name">Статус:</span> ${film.watch ? `<span class="watched">Просмотрен</span>` : `<span class="unwatched">Не просмотрен</span>`}</div>
                </div>
            </div>   
        `;
    }).join('');
}

export function rerenderFilmCard(film) {
    const elem = document.querySelector(`.card.film[data-id="${film.id}"]`); // Найти элемент карточки
    if (!elem) return;
    const newElem = getFilmCardTemplate([film]); // Создать новый элемент
    // Получить node нового элемента
    const newElemPlaceholder = document.createElement('div');
    newElemPlaceholder.innerHTML = newElem;
    const newElemNode = newElemPlaceholder.firstElementChild;
    // Заменить объект
    elem.replaceWith(newElemNode);
}
