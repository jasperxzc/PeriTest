const themeToggleBtn = document.getElementById('theme-toggle');

// 1. Check local storage for a saved theme preference
const currentTheme = localStorage.getItem('theme');

// 2. Apply the saved theme immediately on page load
if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = '🌙'; // Show moon icon if in light mode
}

// 3. Handle the click event
themeToggleBtn.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme');
    
    if (theme === 'light') {
        // Switch to Dark Mode
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        // Switch to Light Mode
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }
});