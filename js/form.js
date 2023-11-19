import { sanitize } from "./helpers.js";
import { getFilmsList, saveFilms } from "./data.js";
import { appendFilmCard } from "./renders.js";

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
    const inputs = form.querySelectorAll("input[name], textarea[name]"); // Получение элементов формы
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
        appendFilmCard(newFilm); // Добавить карточку нового фильма
    }
}
