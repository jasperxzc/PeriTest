// DOM Elements
const hzDisplay = document.getElementById('hz-display');
const intervalDisplay = document.getElementById('interval-display');
const logBody = document.getElementById('log-body');

// State Variables
let lastClickTime = 0;
let moveCount = 0;

// Prevent the default right-click menu from interrupting tests
document.addEventListener('contextmenu', event => event.preventDefault());

// Map numeric hardware outputs to readable names
const buttonMap = {
    0: 'Left Click',
    1: 'Middle Click',
    2: 'Right Click',
    3: 'Side (Back)',
    4: 'Side (Forward)'
};

// Hardware Interrupt: Listen for physical clicks
document.addEventListener('pointerdown', (e) => {
    const currentTime = performance.now(); 
    let interval = 0;

    if (lastClickTime > 0) {
        interval = Math.round(currentTime - lastClickTime);
        intervalDisplay.textContent = `${interval} ms`;
        
        if (interval < 20) {
            intervalDisplay.style.color = '#ff5252'; 
        } else {
            intervalDisplay.style.color = 'var(--lavender-glow)';
        }
    }
    lastClickTime = currentTime;

    // Light up specific SVG button
    const svgPart = document.getElementById(`btn-${e.button}`);
    if (svgPart) svgPart.classList.add('active-svg-part');

    // Log the event
    const buttonName = buttonMap[e.button] !== undefined ? buttonMap[e.button] : `Unknown (${e.button})`;
    logEvent('Down', buttonName, interval);
});

// Listen for button release
document.addEventListener('pointerup', (e) => {
    // Remove light from specific SVG button
    const svgPart = document.getElementById(`btn-${e.button}`);
    if (svgPart) svgPart.classList.remove('active-svg-part');

    const buttonName = buttonMap[e.button] !== undefined ? buttonMap[e.button] : `Unknown (${e.button})`;
    logEvent('Up', buttonName, '---');
});

// Capture Scroll Wheel Rolling and Direction
document.addEventListener('wheel', (e) => {
    const isScrollingDown = e.deltaY > 0;
    const direction = isScrollingDown ? 'Scroll Down' : 'Scroll Up';
    logEvent('Scroll', direction, '---');
    
    // Grab the wheel and arrow SVG elements
    const wheelSvg = document.getElementById('btn-1');
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');
    
    // Light up the scroll wheel itself
    if (wheelSvg) {
        wheelSvg.classList.add('active-svg-part');
        clearTimeout(wheelSvg.scrollTimeout); 
        wheelSvg.scrollTimeout = setTimeout(() => {
            wheelSvg.classList.remove('active-svg-part');
        }, 150);
    }

    // Light up the specific directional arrow
    const activeArrow = isScrollingDown ? arrowDown : arrowUp;
    if (activeArrow) {
        activeArrow.classList.add('active-svg-part');
        clearTimeout(activeArrow.scrollTimeout);
        activeArrow.scrollTimeout = setTimeout(() => {
            activeArrow.classList.remove('active-svg-part');
        }, 150);
    }
});

// Polling Rate Tracker
document.addEventListener('pointermove', () => {
    moveCount++;
});

// Update the Polling Rate display every 1000ms
setInterval(() => {
    hzDisplay.textContent = `${moveCount} Hz`;
    moveCount = 0; 
}, 1000);

// Data Logging Function
function logEvent(action, button, time) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${action}</td>
        <td>${button}</td>
        <td>${time !== '---' ? time + ' ms' : '---'}</td>
    `;
    
    logBody.prepend(row);
    
    // Cap memory usage at 50 rows
    if (logBody.children.length > 50) {
        logBody.lastChild.remove();
    }
}