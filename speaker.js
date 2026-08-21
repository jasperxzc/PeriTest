const leftEar = document.getElementById('left-ear');
const rightEar = document.getElementById('right-ear');
const centerPlay = document.getElementById('center-play');

let audioCtx;
let currentOscillator = null;
let testTimeout = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// panValue: -1 (Left), 1 (Right), 0 (Center)
function playTestTone(panValue, activeSvgElement) {
    initAudio();

    // Reset everything if a tone is already playing
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator.disconnect();
        clearTimeout(testTimeout);
    }
    
    // Clear active classes from all SVG parts
    [leftEar, rightEar, centerPlay].forEach(el => el.classList.remove('is-playing'));

    // Build the audio graph
    currentOscillator = audioCtx.createOscillator();
    const panner = audioCtx.createStereoPanner();
    const gainNode = audioCtx.createGain();

    currentOscillator.type = 'sine';
    currentOscillator.frequency.value = 440; // 440Hz A4 Tone
    
    panner.pan.value = panValue; 

    // Smooth fade in to avoid speakers popping
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);

    // Connect nodes
    currentOscillator.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start playing and trigger visual animation
    currentOscillator.start();
    activeSvgElement.classList.add('is-playing');

    // Auto-stop the tone after 2.5 seconds
    testTimeout = setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        setTimeout(() => {
            if (currentOscillator) currentOscillator.stop();
            activeSvgElement.classList.remove('is-playing');
        }, 100);
    }, 2500);
}

// Event Listeners for the SVG elements
leftEar.addEventListener('click', () => playTestTone(-1, leftEar));
rightEar.addEventListener('click', () => playTestTone(1, rightEar));
centerPlay.addEventListener('click', () => playTestTone(0, centerPlay));