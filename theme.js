const themeToggleBtn = document.getElementById('theme-toggle');

// Crisp, Balanced Line-Art Icons
const sunIconSVG = `
    <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
`;

const moonIconSVG = `
    <svg viewBox="0 0 24 24">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
`;

// Apply saved theme on page load
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = moonIconSVG;
} else {
    if (themeToggleBtn) themeToggleBtn.innerHTML = sunIconSVG;
}

// Toggle on click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.getAttribute('data-theme') === 'light';
        
        if (isLight) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = sunIconSVG;
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = moonIconSVG;
        }
    });
}