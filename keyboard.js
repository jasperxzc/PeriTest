const container = document.getElementById('keyboard-container');
const nkroDisplay = document.getElementById('nkro-display');
const maxNkroDisplay = document.getElementById('max-nkro-display');
const chatterDisplay = document.getElementById('chatter-display');
const btnReset = document.getElementById('reset-keyboard');
const layoutSelect = document.getElementById('layout-select');

// State tracking
let keysCurrentlyPressed = new Set();
let maxNkro = 0;
let keyTimestamps = {}; 
let registeredKeys = new Set(); // Remember which keys have been pressed across layout changes

// Layout Matrix mapped with specific sections (s)
// Sections: 'm' (main), 'f' (f-row), 'n' (nav cluster), 'p' (numpad)
const layout = [
    [
        {c: 'Escape', l: 'Esc', s: 'f'}, {w: 'spacer', s: 'f'}, {c: 'F1', l: 'F1', s: 'f'}, {c: 'F2', l: 'F2', s: 'f'}, {c: 'F3', l: 'F3', s: 'f'}, {c: 'F4', l: 'F4', s: 'f'}, {w: 'spacer', s: 'f'}, {c: 'F5', l: 'F5', s: 'f'}, {c: 'F6', l: 'F6', s: 'f'}, {c: 'F7', l: 'F7', s: 'f'}, {c: 'F8', l: 'F8', s: 'f'}, {w: 'spacer', s: 'f'}, {c: 'F9', l: 'F9', s: 'f'}, {c: 'F10', l: 'F10', s: 'f'}, {c: 'F11', l: 'F11', s: 'f'}, {c: 'F12', l: 'F12', s: 'f'}, {w: 'spacer', s: 'n'}, {c: 'PrintScreen', l: 'PrtSc', s: 'n'}, {c: 'ScrollLock', l: 'ScrLk', s: 'n'}, {c: 'Pause', l: 'Pause', s: 'n'}
    ],
    [
        {c: 'Backquote', l: '`', s: 'm'}, {c: 'Digit1', l: '1', s: 'm'}, {c: 'Digit2', l: '2', s: 'm'}, {c: 'Digit3', l: '3', s: 'm'}, {c: 'Digit4', l: '4', s: 'm'}, {c: 'Digit5', l: '5', s: 'm'}, {c: 'Digit6', l: '6', s: 'm'}, {c: 'Digit7', l: '7', s: 'm'}, {c: 'Digit8', l: '8', s: 'm'}, {c: 'Digit9', l: '9', s: 'm'}, {c: 'Digit0', l: '0', s: 'm'}, {c: 'Minus', l: '-', s: 'm'}, {c: 'Equal', l: '=', s: 'm'}, {c: 'Backspace', l: 'Backspace', w: 'w-2', s: 'm'}, {w: 'spacer', s: 'n'}, {c: 'Insert', l: 'Ins', s: 'n'}, {c: 'Home', l: 'Home', s: 'n'}, {c: 'PageUp', l: 'PgUp', s: 'n'}, {w: 'spacer', s: 'p'}, {c: 'NumLock', l: 'Num', s: 'p'}, {c: 'NumpadDivide', l: '/', s: 'p'}, {c: 'NumpadMultiply', l: '*', s: 'p'}, {c: 'NumpadSubtract', l: '-', s: 'p'}
    ],
    [
        {c: 'Tab', l: 'Tab', w: 'w-1-5', s: 'm'}, {c: 'KeyQ', l: 'Q', s: 'm'}, {c: 'KeyW', l: 'W', s: 'm'}, {c: 'KeyE', l: 'E', s: 'm'}, {c: 'KeyR', l: 'R', s: 'm'}, {c: 'KeyT', l: 'T', s: 'm'}, {c: 'KeyY', l: 'Y', s: 'm'}, {c: 'KeyU', l: 'U', s: 'm'}, {c: 'KeyI', l: 'I', s: 'm'}, {c: 'KeyO', l: 'O', s: 'm'}, {c: 'KeyP', l: 'P', s: 'm'}, {c: 'BracketLeft', l: '[', s: 'm'}, {c: 'BracketRight', l: ']', s: 'm'}, {c: 'Backslash', l: '\\', w: 'w-1-5', s: 'm'}, {w: 'spacer', s: 'n'}, {c: 'Delete', l: 'Del', s: 'n'}, {c: 'End', l: 'End', s: 'n'}, {c: 'PageDown', l: 'PgDn', s: 'n'}, {w: 'spacer', s: 'p'}, {c: 'Numpad7', l: '7', s: 'p'}, {c: 'Numpad8', l: '8', s: 'p'}, {c: 'Numpad9', l: '9', s: 'p'}, {c: 'NumpadAdd', l: '+', s: 'p'}
    ],
    [
        {c: 'CapsLock', l: 'Caps', w: 'w-1-75', s: 'm'}, {c: 'KeyA', l: 'A', s: 'm'}, {c: 'KeyS', l: 'S', s: 'm'}, {c: 'KeyD', l: 'D', s: 'm'}, {c: 'KeyF', l: 'F', s: 'm'}, {c: 'KeyG', l: 'G', s: 'm'}, {c: 'KeyH', l: 'H', s: 'm'}, {c: 'KeyJ', l: 'J', s: 'm'}, {c: 'KeyK', l: 'K', s: 'm'}, {c: 'KeyL', l: 'L', s: 'm'}, {c: 'Semicolon', l: ';', s: 'm'}, {c: 'Quote', l: '\'', s: 'm'}, {c: 'Enter', l: 'Enter', w: 'w-2-25', s: 'm'}, {w: 'spacer', s: 'n'}, {w: 'spacer', l: '', s: 'n'}, {w: 'spacer', l: '', s: 'n'}, {w: 'spacer', l: '', s: 'n'}, {w: 'spacer', s: 'p'}, {c: 'Numpad4', l: '4', s: 'p'}, {c: 'Numpad5', l: '5', s: 'p'}, {c: 'Numpad6', l: '6', s: 'p'}, {c: 'NumpadEnter', l: 'Ent', s: 'p'}
    ],
    [
        {c: 'ShiftLeft', l: 'Shift', w: 'w-2-25', s: 'm'}, {c: 'KeyZ', l: 'Z', s: 'm'}, {c: 'KeyX', l: 'X', s: 'm'}, {c: 'KeyC', l: 'C', s: 'm'}, {c: 'KeyV', l: 'V', s: 'm'}, {c: 'KeyB', l: 'B', s: 'm'}, {c: 'KeyN', l: 'N', s: 'm'}, {c: 'KeyM', l: 'M', s: 'm'}, {c: 'Comma', l: ',', s: 'm'}, {c: 'Period', l: '.', s: 'm'}, {c: 'Slash', l: '/', s: 'm'}, {c: 'ShiftRight', l: 'Shift', w: 'w-2-25', s: 'm'}, {w: 'spacer', s: 'n'}, {w: 'spacer', l: '', s: 'n'}, {c: 'ArrowUp', l: '↑', s: 'n'}, {w: 'spacer', l: '', s: 'n'}, {w: 'spacer', s: 'p'}, {c: 'Numpad1', l: '1', s: 'p'}, {c: 'Numpad2', l: '2', s: 'p'}, {c: 'Numpad3', l: '3', s: 'p'}, {c: 'NumpadEnter', l: 'Ent', s: 'p'} 
    ],
    [
        {c: 'ControlLeft', l: 'Ctrl', w: 'w-1-5', s: 'm'}, {c: 'MetaLeft', l: 'Win', s: 'm'}, {c: 'AltLeft', l: 'Alt', s: 'm'}, {c: 'Space', l: 'Space', w: 'w-space', s: 'm'}, {c: 'AltRight', l: 'Alt', s: 'm'}, {c: 'MetaRight', l: 'Win', s: 'm'}, {c: 'ContextMenu', l: 'Menu', s: 'm'}, {c: 'ControlRight', l: 'Ctrl', w: 'w-1-5', s: 'm'}, {w: 'spacer', s: 'n'}, {c: 'ArrowLeft', l: '←', s: 'n'}, {c: 'ArrowDown', l: '↓', s: 'n'}, {c: 'ArrowRight', l: '→', s: 'n'}, {w: 'spacer', s: 'p'}, {c: 'Numpad0', l: '0', w: 'w-2', s: 'p'}, {c: 'NumpadDecimal', l: '.', s: 'p'}
    ]
];

// Rebuilds the DOM based on selected layout
function generateKeyboard(layoutType) {
    container.innerHTML = ''; 
    
    layout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        let keysInRow = 0; // Track if we actually added anything to this row
        
        row.forEach(key => {
            // Layout Filtering Logic
            if (layoutType === 'tkl' && key.s === 'p') return; 
            if (layoutType === '60' && (key.s === 'p' || key.s === 'n' || key.s === 'f')) return;
            
            keysInRow++;
            const keyDiv = document.createElement('div');
            keyDiv.classList.add('key');
            if (key.w) keyDiv.classList.add(key.w);
            if (key.c) {
                keyDiv.id = `key-${key.c}`;
                // Restore registered state if it was pressed previously
                if (registeredKeys.has(key.c)) keyDiv.classList.add('registered-key');
            }
            keyDiv.textContent = key.l || '';
            rowDiv.appendChild(keyDiv);
        });
        
        // Only append the row if it's not entirely empty (e.g. the F-row on a 60% layout)
        if (keysInRow > 0) {
            container.appendChild(rowDiv);
        }
    });
}

// Initial Build
generateKeyboard(layoutSelect.value);

// Listen for Dropdown Changes
layoutSelect.addEventListener('change', (e) => {
    generateKeyboard(e.target.value);
});

// Hardware Event Listeners
document.addEventListener('keydown', (e) => {
    if (!['F5', 'F12'].includes(e.code) && !e.ctrlKey) {
        e.preventDefault();
    }

    const keyElement = document.getElementById(`key-${e.code}`);
    if (keyElement) {
        keyElement.classList.add('active-key');
        keyElement.classList.add('registered-key');
    }
    
    // Store in global memory so it stays registered if they switch layouts
    registeredKeys.add(e.code);

    keysCurrentlyPressed.add(e.code);
    updateNKRO();

    const now = performance.now();
    if (keyTimestamps[e.code] && !e.repeat) {
        const interval = Math.round(now - keyTimestamps[e.code]);
        chatterDisplay.textContent = `${interval} ms`;
        chatterDisplay.style.color = interval < 30 ? '#ff5252' : 'var(--text-main)';
    }
});

document.addEventListener('keyup', (e) => {
    if (!['F5', 'F12'].includes(e.code) && !e.ctrlKey) {
        e.preventDefault();
    }

    const keyElement = document.getElementById(`key-${e.code}`);
    if (keyElement) {
        keyElement.classList.remove('active-key');
    }

    keysCurrentlyPressed.delete(e.code);
    updateNKRO();
    keyTimestamps[e.code] = performance.now();
});

function updateNKRO() {
    const current = keysCurrentlyPressed.size;
    nkroDisplay.textContent = current;
    if (current > maxNkro) {
        maxNkro = current;
        maxNkroDisplay.textContent = maxNkro;
    }
}

// Reset Button Logic
btnReset.addEventListener('click', () => {
    document.querySelectorAll('.key').forEach(k => k.classList.remove('registered-key', 'active-key'));
    keysCurrentlyPressed.clear();
    registeredKeys.clear();
    maxNkro = 0;
    updateNKRO();
    chatterDisplay.textContent = '---';
    chatterDisplay.style.color = 'var(--text-main)';
});