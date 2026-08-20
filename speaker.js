const btnLeft = document.getElementById('play-left');
const btnBoth = document.getElementById('play-both');
const btnRight = document.getElementById('play-right');

let audioCtx;

// Helper function to play a tone on a specific channel
// panValue: -1 (Left), 0 (Center), 1 (Right)
function playTestTone(panValue, buttonElement) {
    // Initialize AudioContext on first click (browser policy)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create an oscillator to generate a clean 440Hz tone (A4 note)
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;

    // Create a Stereo Panner to handle the Left/Right routing
    const panner = audioCtx.createStereoPanner();
    panner.pan.value = panValue;

    // Create a Gain Node to control volume and fade out smoothly (prevents audio clicking)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Start at 50% volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); // Fade out over 1.5 seconds

    // Connect the audio graph: Oscillator -> Panner -> Gain -> Speakers
    oscillator.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Play the tone for exactly 1.5 seconds
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);

    // Visual feedback on the button
    const originalText = buttonElement.textContent;
    buttonElement.textContent = "Playing...";
    buttonElement.style.borderColor = "var(--lavender-glow)";
    buttonElement.style.color = "var(--text-main)";

    setTimeout(() => {
        buttonElement.textContent = originalText;
        // Reset colors based on which button it was
        if (buttonElement.id === 'play-both') {
            buttonElement.style.color = "white";
        } else {
            buttonElement.style.borderColor = "var(--purple-deep)";
            buttonElement.style.color = "var(--lavender-glow)";
        }
    }, 1500);
}

// Event Listeners
btnLeft.addEventListener('click', function() {
    playTestTone(-1, this);
});

btnBoth.addEventListener('click', function() {
    playTestTone(0, this);
});

btnRight.addEventListener('click', function() {
    playTestTone(1, this);
});