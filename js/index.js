import { initTheme } from "./theme.js";
import { renderNotFound } from "./renders.js";

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
    initTheme()
}

// Маршрутизация
function router() {
    const hash = window.location.hash; // Текущее положение хеша
    if (hash === '')
        return 
    else 
        return renderNotFound();
}

window.addEventListener('hashchange', () => {
    const content = document.querySelector('.content');
    if (!content) return;
    content.replaceChildren(router());
});

