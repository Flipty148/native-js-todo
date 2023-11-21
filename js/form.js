import { sanitize } from "./helpers.js";
import { getFilmsList, saveFilms, getFilmById } from "./data.js";
import { appendFilmCard, removeModal } from "./renders.js";
import { updateContent } from "./index.js";
import { handleRemoveFilm } from "./events.js";

let removeConfirm = false;

/**
 * Функция получающая значения элементов формы
 * @param {Event} event 
 * @returns {{[key: string]: string}}
 */
function handleForm(event) {
    event.preventDefault(); // Отмена действия по умолчанию для события
    const form = event.target; // Получение формы
    if (!(form instanceof HTMLFormElement)) throw new Error("form must be a HTMLFormElement");
    const values = {};
    const inputs = form.querySelectorAll("input[name], textarea[name], select[name]"); // Получение элементов формы
    inputs.forEach(input => {
        values[input.name] = sanitize(input.value); //Записать значение
        input.value = ""; // Очистить значение
    })
    return {values};
}

export function handleAddFilmForm(event) {
    const {values : {title, description, genres}} = handleForm(event);
    if (title) {
        const films = getFilmsList(); // Получить список фильмов
        const gen = genres.split(';').map((genre)=> {
            let res = genre.toLowerCase();
            res = res.replace(/\s+/g, '');
            res = res.charAt(0).toUpperCase() + res.slice(1);
            return res;
        });
        const newFilm = {
            id: films.length + 1,
            title,
            description,
            genres: gen,
            watch: false
        } //Новый фильм
        films.push(newFilm); // Вставить новый фильм
        saveFilms(); //Сохранить фильмы
        if (films.length === 1)
            updateContent();
        else
            appendFilmCard(newFilm); // Добавить карточку нового фильма
    }
}

export function handleRemoveConfirm(event, filmId) {
    event.preventDefault();
    const submitter = event.submitter;
    if (!submitter) return;
    const val = submitter.value;
    if (val === "confirm")
        handleRemoveFilm(filmId);
    removeModal();
}

export function handleEditFilm(event) {
    const {values : {title, description, genres, status} } = handleForm(event); // Получение данных формы
    const form = event.target; // Получение формы
    const filmId = form.dataset.filmId; // Получение id фильма
    const film = getFilmById(filmId); // Получение фильма
    if (!film) return;
    film.title = title; //Смена названия фильма
    film.description = description; // Смена описания фильма
    const gen = genres.split(';').map((genre)=> {
        let res = genre.toLowerCase();
        res = res.replace(/\s+/g, '');
        res = res.charAt(0).toUpperCase() + res.slice(1);
        return res;
    });
    film.genres = gen; //Смена жанров
    film.watch = status === 'true'; //Смена статуса
    saveFilms(); // Сохранение списка фильмов
    window.location.hash = ''; // Переход на главную страницу
}
