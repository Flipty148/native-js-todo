import { initTheme } from "./theme.js";
import { renderNotFound, renderFilmsList } from "./renders.js";
import {getBaseFilmsList } from "./data.js";

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
    initTheme();
    updateContent();
}

// Маршрутизация
function router() {
    const hash = window.location.hash; // Текущее положение хеша
    if (hash === '')
        return renderFilmsList(getBaseFilmsList());
    else 
        return renderNotFound();
}

function updateContent() {
  const content = document.querySelector('.content');
  if (!content) return;
  content.replaceChildren(router());
}

window.addEventListener('hashchange', updateContent());

