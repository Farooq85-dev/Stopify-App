// Theme Toggler 
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check if dark mode is enabled and set the initial theme
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
if (isDarkMode) {
    enableDarkMode();
}

// Toggle between dark and light modes
themeToggleBtn.addEventListener('click', () => {
    event.preventDefault();
    if (body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Enable dark mode
function enableDarkMode() {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('darkMode', 'enabled');
}

// Disable dark mode
function disableDarkMode() {
    body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('darkMode', null);
}
