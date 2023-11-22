// @ts-check
/// <reference path="./types.d.ts"/>

/** @type {Film[] | null} */
let filmsStorage = null;

/**
 * Функция, которая возвращает список фильмов
 * @returns {Film[]}
 */
export function getFilmsList() {
    const baseFilmsList = [
        {
            id : 0,
            title : 'Большой куш',
            description : 'Художественный фильм скомпилировали. В главных ролях Джейсон Стейтмент, Тони 44 правила, а также Конфликт Хрен-Решишь',
            genres : ["Комедия", "Драма", "Криминал"],
            watch : false
        },
        {
            id : 1,
            title : 'Зеленая миля',
            description : 'Очень грустный фильм',
            genres : ["Фэнтези", "Драма", "Криминал"],
            watch : true
        }
    ]; // Стандартный набор фильмов
    if (filmsStorage) return filmsStorage; // Если хранилище фильмов не пустое
    const filmsInLocalStorage = localStorage.getItem('films'); // Фильмы в локальном хранилище
    if (filmsInLocalStorage) { // Если фильмы находяться в локальном хранилище
        try {
            filmsStorage = JSON.parse(filmsInLocalStorage); // Считать данные с локального хранилища
            //@ts-ignore
            return filmsStorage;
        }
        catch (e) {
            localStorage.removeItem('films'); // Очистить список в локальном хранилище
        }
    }
    else {
        filmsStorage = baseFilmsList; // Занести список фильмов по умолчанию
        localStorage.setItem('films', JSON.stringify(filmsStorage)); // ЗАгрузить стандартный список фильмов в локальное хранилище

    }

    return filmsStorage === null ? [] : filmsStorage; // Вернуть список фильмов
}

/**
 * Возвращает фильм по его id
 * @param {number} id 
 */
export function getFilmById(id) {
    filmsStorage = getFilmsList();
    return filmsStorage?.find(film => film.id === Number(id))
}


/**
 * Функция, которая выполняет сохранение фильмов в локальное хранилище
 */
export function saveFilms() {
    const films = getFilmsList(); // Получить фильмы
    localStorage.setItem('films', JSON.stringify(films)); // ЗАписать в хранилище
}

/**
 * Функция, которая формирует множество жанров
 */
export function getAllGenres() {
    const res = new Set(); // Создание множества
    const films = getFilmsList(); // Получение списка фильмов
    films.forEach( (film) => {
        film.genres.forEach( (genre) => {
            res.add(genre);
        })
    }); // Формирование множества жанров
    const resArr = Array.from(res).sort(); // Сортировка в алфавитном порядке
    return resArr;
}

export function getFilteredFilmsList(watch, genres) {
    const films = getFilmsList(); //Получить список фильмов
    let res = new Set();
    films.forEach( (film) => {
        if (watch === 'true') {
            if (film.watch && (film.genres.some(genre => genres.includes(genre)) || genres.length === 0 ))
                res.add(film);
            if (film.watch && film.genres[0] === "" && genres.includes('Без жанра'))
                res.add(film);
        }
        else if (watch ==='false') {
            if (!film.watch && (film.genres.some(genre => genres.includes(genre)) || genres.length === 0))
                res.add(film);
            if (!film.watch && film.genres[0] === "" && genres.includes('Без жанра'))
                res.add(film);
        }
        else {
            if (genres.length === 0)
                res.add(film);
            else if (film.genres.some(genre => genres.includes(genre)))
                res.add(film);  
            if (film.genres[0] === "" && genres.includes('Без жанра'))
                res.add(film);              
        }
    });
    return Array.from(res);    
}
