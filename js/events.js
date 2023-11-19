// @ts-check
/// <reference path="./types.d.ts"/>

import { saveFilms, getFilmById, getFilmsList } from './data.js';
import {  handleRemoveConfirm } from './form.js';
import { partial, toJson } from './helpers.js';
import { updateContent } from './index.js';
import {removeFilmCard, renderModal, renderRemoveConfirm, rerenderFilmCard} from './renders.js';

/**
 * Функция обработки события смена статуса фильма
 * @param {number} filmId 
 */
function handleToggleFilmStatus(filmId)
{
    const film = getFilmById(filmId); // Получить фильм по id
    if (!film) return; // Если фильм не найден
    film.watch = !film.watch // Переключить статус фильма
    saveFilms(); // Сохранить список фильмов в локальное хранилище
    rerenderFilmCard(film); // Перерисовать содержимое
}

/**
 * Функция обработки dropdown
 */
export function handleDropdown(event) {
    const dropdown = event.target.closest('.dropdown');
    // Закрыть другие dropdown
    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
        if (otherDropdown !== dropdown)
            otherDropdown.classList.remove('dropdown-open');
    });
    // Открыть соответствующий dropdown
    if (dropdown && event.target.closest('#dropdown-description-button'))
        dropdown.classList.toggle('dropdown-open');
    else if (dropdown && event.target.closest('#dropdown-genres-button'))
        dropdown.classList.toggle('dropdown-open');
    else if (!dropdown || (!event.target.closest('textarea') && !event.target.closest('input'))) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('dropdown-open');
        });
    }
} 

function handleShowRemoveFilmConfirmation(filmId) {
    const film = getFilmById(filmId); // Найти фильм по Id
    if (!film) return; //Фильм не найден
    const res = renderModal(renderRemoveConfirm(film));
    const modal = res.querySelector('.modal');
    if (!modal) return;
    modal.classList.add('modal-open');
    document.body.append(modal);
}

/**
 * Функция обработки события удаления фильма
 * @param {Number} filmId 
 * @returns 
 */
export function handleRemoveFilm(filmId) {
    const film = getFilmById(filmId); // Найти фильм по Id
    const filmList = getFilmsList(); // Список фильмов
    if (!film) return; //Фильм не найден
    const index = filmList.indexOf(film) // Найти индекс фильма в списке
    filmList.splice(index, 1); // Удалить фильм из списка
    saveFilms(); // Сохранения списка фильмов 
    if (filmList.length === 0)
        updateContent(); // Обновить содержимое страницы
    else
        removeFilmCard(filmId); // Удалить карточку фильма
}

function initDispatchEvents() {
    /**
   * @param {string} eventName 
   * @param {Record<string, any>} [detail] 
   */
    function dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {detail});
        document.dispatchEvent(event);
    }
    window.dispatch = dispatchEvent;
}

/**
 * Добавление события
 */
function addEvent(eventName, callback) {
    document.addEventListener(eventName, (event) => {
        callback(event.detail);
    });
}

export function initEvents() {
    initDispatchEvents();
    addEvent(events.toggleFilmStatus, handleToggleFilmStatus);
    addEvent(events.removeFilm, handleShowRemoveFilmConfirmation);
}

const events = {
    toggleFilmStatus : "toggle-film-status",
    removeFilm : "remove-film"
};

/**
 * @param {string} eventName
 * @param {any} details
 */
function baseDispatch(eventName, details) {
    return `window.dispatch?.call(null, '${eventName}', ${toJson(details)})`
}

export const dispatchToggleFilmStatus = partial(baseDispatch, events.toggleFilmStatus); // Dispatch для переключения статуса фильма

export const dispatchRemoveFilm = partial(baseDispatch, events.removeFilm); // Dispatch для удаления фильма
