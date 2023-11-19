import { dispatchToggleFilmStatus } from "./events.js";
import { arrayToString } from "./helpers.js";
import { eyeIcon, eyeOffIcon } from "./icons.js";
import { handleAddFilmForm } from "./form.js";


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
                ? /*html*/`<h5 class="no-films">Список фильмов пуст.</h5>` 
                : getFilmCardTemplate(filmsList)}
        </div>
        <div class="films-add">
            <form class="form-films-add" role="form" method="post">
                <input class="films-title-input" type="text" name="title" placeholder="Название фильма" ${validation('название фильма')}>
                <div class="dropdown">
                    <div class="dropdown-description">
                        <button class="btn btn-primary" id="dropdown-description-button" type="button">Описание</button>
                    </div>
                    <div class="dropdown-content-wrapper">
                        <div class="dropdown-content">
                            <textarea placeholder="Описание" class="description-textarea" id="description-textarea" name="description"></textarea>
                        </div>
                    </div>
                </div>
                <div class="dropdown">
                    <div class="dropdown-genres">
                        <button class="btn btn-primary" id="dropdown-genres-button" type="button">Жанры</button>
                    </div>
                    <div class="dropdown-content-wrapper">
                        <div class="dropdown-content">
                            <input placeholder="Жанры, разделенные ';'" class="genres-input" id="genres-input" name="genres"/>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary", type="submit" id="film-add-button">Добавить</button>
            </form>
        </div>
    </div>
    `;
    const form = page.querySelector('.form-films-add');
    form.addEventListener('submit', handleAddFilmForm);
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

/**
 * Добавление карточки
 * @param {Film} film 
 * @returns 
 */
export function appendFilmCard(film) {
    const filmList = document.querySelector('.films__list');
    if (!filmList) return; 
    filmList.insertAdjacentHTML("beforeend", getFilmCardTemplate([film]));
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

function validation(value) {
    return /*html*/`
        required
        oninvalid="this.setCustomValidity('Введие корректное ${value}');this.parentElement.classList.add('input-error')"
        oninput="this.setCustomValidity('');this.parentElement.classList.remove('input-error');"
    `
}
