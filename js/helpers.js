/**
 * Функция преобразования массива в строку
 * @param {Array} array 
 */
export function arrayToString(array) {
    let str = "";
    array.forEach(element => {
        str += " " + element.toString();
    });
    return str;
}