// @ts-check
/// <reference path="./types.d.ts"/>

import { saveFilms, getFilmById } from './data.js';
import { partial, toJson } from './helpers.js';
import {updateContent} from './index.js';

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
    updateContent(); // Перерисовать содержимое
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
}

const events = {
    toggleFilmStatus : "toggle-film-status"
};

/**
 * @param {string} eventName
 * @param {any} details
 */
function baseDispatch(eventName, details) {
    return `window.dispatch?.call(null, '${eventName}', ${toJson(details)})`
  }

export const dispatchToggleFilmStatus = partial(baseDispatch, events.toggleFilmStatus); // Dispatch для переключения статуса фильма
