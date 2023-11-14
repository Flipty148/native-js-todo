
function fragment(strings, ...values) {
    const str = strings.reduce( (buffer, string, i) => buffer +  string + (values[i] ?? ''), '' ); // Формирование строки для построения
    const template = document.createElement('template');
    template.innerHTML = strings;
    return template.content;
}

export function renderNotFound() {
    return fragment/*html*/`
        <h1>PAGE NOT FOUND</h1>
    `;
}
