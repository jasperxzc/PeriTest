const themeToggleBtn = document.getElementById('theme-toggle');

// Hollow Line SVG Templates
const sunIconSVG = `
    <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="1" y2="3"></line>
        <line x1="12" y1="21" x2="1" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
`;

const moonIconSVG = `
    <svg viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
`;

// 1. Check and apply saved preference
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = moonIconSVG;
} else {
    if (themeToggleBtn) themeToggleBtn.innerHTML = sunIconSVG;
}

// 2. Toggle on click
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