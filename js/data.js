//@ts-check

/**
 * Функция, которая возвращает стандартный список фильмов
 * @returns {Film[]}
 */
export function getBaseFilmsList() {
    const baseFilmsList = [
        {
            id : 1,
            title : 'Большой куш',
            description : 'Художественный фильм скомпилировали. В главных ролях Джейсон Стейтмент, Тони 44 правила, а также Конфликт Хрен-Решишь',
            genres : ["Комедия", "Драма", "Криминал"],
            watch : false
        },
        {
            id : 2,
            title : 'Зеленая миля',
            description : 'Очень грустный фильм',
            genres : ["Фэнтези", "Драма", "Криминал"],
            watch : true
        }
    ];
    return baseFilmsList;
}