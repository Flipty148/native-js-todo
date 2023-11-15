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

export function partial(fn, ...apply) {
    return (...args) => fn(...apply, ...args);
}

export function toJson(value) {
    try {
      return JSON.stringify(value).replace(/"/g, "'");
    } catch (e) {
      return null;
    }
  }


