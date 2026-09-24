const themeToggle = document.getElementById('theme-toggle');

const preference = localStorage.getItem('theme');
if(preference == 'dark'){
    document.body.setAttribute('data-theme','dark');
    themeToggle.textContent = 'Modo claro';
}

themeToggle.addEventListener('click', event => {
    if(document.body.getAttribute('data-theme') === 'dark'){
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = 'Modo oscuro';
        localStorage.setItem('theme','light');
    }
    else{
        document.body.setAttribute('data-theme','dark');
        themeToggle.textContent = 'Modo claro';
        localStorage.setItem('theme','dark');
    }
});