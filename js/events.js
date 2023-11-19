// @ts-check
/// <reference path="./types.d.ts"/>

import { saveFilms, getFilmById } from './data.js';
import { handleAddFilmForm } from './form.js';
import { partial, toJson } from './helpers.js';
import {rerenderFilmCard} from './renders.js';

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
    addEvent(events.addNewFilm, handleAddFilmForm);
}

const events = {
    toggleFilmStatus : "toggle-film-status",
};

/**
 * @param {string} eventName
 * @param {any} details
 */
function baseDispatch(eventName, details) {
    return `window.dispatch?.call(null, '${eventName}', ${toJson(details)})`
}

export const dispatchToggleFilmStatus = partial(baseDispatch, events.toggleFilmStatus); // Dispatch для переключения статуса фильма


