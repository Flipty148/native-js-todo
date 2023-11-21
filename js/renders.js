import { dispatchRemoveFilm, dispatchToggleFilmStatus } from "./events.js";
import { arrayToString } from "./helpers.js";
import { deleteIcon, eyeIcon, eyeOffIcon, editIcon, backIcon } from "./icons.js";
import { handleAddFilmForm, handleRemoveConfirm, handleEditFilm } from "./form.js";
import { getAllGenres } from "./data.js";


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
    <h1 class="page-title">Список фильмов для просмотра</h1>
    <div class="films-list">
        <div class="filters-block">
            <label class="filters-label">Статус 
                <select class="filters-whatch">
                    <option value="all" selected>Все</option>
                    <option value="true">Просмотрен</option>
                    <option value="false">Не просмотрен</option>
                </select>
            </label>
            <label class="filters-label">Жанры
                ${(function fun() { // Вывод списка жанров
                    const genres = getAllGenres();
                    let res = "";
                    genres.forEach((genre) => {
                        res += getCheckboxTemplate(genre);
                    });
                    return res;
                })()}
            </label>
        </div>
        <div class="films-block">
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
    </div>
    `;
    const form = page.querySelector('.form-films-add');
    form.addEventListener('submit', handleAddFilmForm);
    return page;
}

function getCheckboxTemplate(element) {
    return /*html*/`
    <label class="checkbox-label">
        <input class="checkbox-input" type="checkbox" name="${element ? element : 'Без жанра'}" />
        ${element ? element : 'Без жанра'}
    </label>
    `
}

/**
 * Отрисовка карточек фильмов
 * @param {Film[]} filmList
 */
function getFilmCardTemplate(filmsList) {
    return filmsList.map(film => {
        return /*html*/`
            <div class="list__item card film" data-id="${film.id}">
                <div class="card-body" onclick="${dispatchToggleFilmStatus(film.id)}">
                    <div class="card-header film-header ${film.watch ? 'film-header__watch' : ''}" >
                        <h5 class="card-title">${film.title}</h5>
                    </div>
                    <div class="card-content">
                        <div class="film-description"><span class="card-point-name">Описание:</span> ${film.description} </div>
                        <div class="film-genres"><span class="card-point-name">Жанры:</span> ${arrayToString(film.genres)}</div>
                        <div class="film-status"><span class="card-point-name">Статус:</span> ${film.watch ? `<span class="watched">Просмотрен</span>` : `<span class="unwatched">Не просмотрен</span>`}</div>
                    </div>
                </div>
                <div class="card-icons">
                    <div class="card-icon film-status-icon" onclick="${dispatchToggleFilmStatus(film.id)}">${film.watch ? eyeOffIcon() : eyeIcon()}</div>
                    <a class="btn-icon btn-icon-edit" type="button" href="#/film/${film.id}/edit">${editIcon()}</a>
                    <a class="btn-icon btn-icon-danger" type="button" onclick="${dispatchRemoveFilm(film.id)}">${deleteIcon()}</a>
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

/**
 * Удаление карточки
 * @param {Number} filmId 
 */
export function removeFilmCard(filmId) {
    const filmCard = document.querySelector(`.films__list .film[data-id="${filmId}"]`); // Найти карточку фильма
    filmCard.remove(); // Удалить карточку фильма
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

/**
 * Функция отрисовки модального окна
 */
export function renderModal(content) {
    const modal = fragment/*html*/`
    <div class="modal">
        <div class="modal-content">
        </div>
    </div>
    `;
    const modalContent = modal.querySelector('.modal-content');
    modalContent.appendChild(content);
    return modal;
}

export function removeModal() {
    const modal = document.querySelector('.modal');
    modal.remove();
}

export function renderRemoveConfirm(film) {
    const content = fragment/*html*/`
    <div class="remove-confitm">
        <h3>Вы действительно хотите удалить следующий фильм: ${film.title}?</h3>
        <form class="form-remove-confirm">
            <button class="btn btn-danger" type="submit" value="confirm">Да</button>
            <button class="btn btn-green" type="submit" value="cancel">Нет</button>
        </form>
    </div>
    `;
    const form = content.querySelector('.form-remove-confirm');
    form.addEventListener('submit', (e) => handleRemoveConfirm(e, film.id));
    return content;
}

export function renderEditFilm(film) {
    const page = fragment/*html*/`
    <div class="film-edit">
        <h1 class="page-title">Редактирование фильма<br> ${film.title}</h1>
        <form class="form-film-edit" method="post" data-film-id=${film.id}>
            <label class="form-label edit-form-label">
                <span class="edit-form-label-text">Название</span>
                <input type="text" class="input" placeholder="Измените название" value="${film.title}" ${validation('название фильма')} name="title"/>
            </label>
            <label class="form-label edit-form-label">
                <span class="edit-form-label-text">Описание</span>
                <textarea class="textarea" placeholder="Измените описание" name="description">${film.description}</textarea>
            </label>
            <label class="form-label edit-form-label">
                <span class="edit-form-label-text">Жанры</span>
                <input type="text" class="input" placeholder="Измените жанры, указав их через ';'" name="genres" value="${String(film.genres).replaceAll(',', ';')}" />
            </label>
            <label class="form-label edit-label">
                <span class="edit-form-label-text">Статус</span>
                <select class="input" name="status">
                    <option value="true" ${film.watch ? 'selected' : ''}>Просмотрен</option>
                    <option value="false" ${!film.watch ? 'selected' : ''}>Не просмотрен</option>
                </select>
            </label>
            <div class="edit-form-buttons">
                <button type="button" class="btn btn-primary" id="cancel-edit" onclick="history.back()">${backIcon()} Отменить изменения</button>
                <button type="submit" class="btn btn-primary" id="save-edit">${editIcon()} Сохранить изменения</button>
            </div>
        </form>
    </div>
    `;
    page.querySelector('.form-film-edit').addEventListener('submit', handleEditFilm);
    return page;   
}