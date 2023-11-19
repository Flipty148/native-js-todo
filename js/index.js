import { initTheme } from "./theme.js";
import { renderNotFound, renderFilmsList } from "./renders.js";
import {getFilmsList } from "./data.js";
import { initEvents, handleDropdown } from "./events.js";

const stylesLink = document.createElement("link");
stylesLink.rel = "stylesheet";
stylesLink.href = "css/index.css";
document.head.append(stylesLink);

document.addEventListener("DOMContentLoaded", start);

// Функция запуска
function start() {
    const root = document.getElementById("root"); //Корневой узел
    if (!root) return; //Узел не найден
    root.innerHTML = /*html*/`
      <div class="container">
        <div class="content"></div>
      </div>`; 
    root.addEventListener('click', handleDropdown);
    initTheme();
    initEvents();
    updateContent(); //Временно
}

export function updateContent() {
  const content = document.querySelector('.content');
  if (!content) return;
  content.replaceChildren(router());
}

// Маршрутизация
function router() {
  const hash = window.location.hash; // Текущее положение хеша
  if (hash === '')
      return renderFilmsList(getFilmsList());
  else 
      return renderNotFound();
}

window.addEventListener('hashchange', updateContent());

