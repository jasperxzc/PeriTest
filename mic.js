// DOM Elements
const btnStart = document.getElementById('start-mic');
const statusText = document.getElementById('mic-status');
const canvas = document.getElementById('mic-visualizer');
const canvasCtx = canvas.getContext('2d');
const btnRecord = document.getElementById('record-btn');
const audioPlayback = document.getElementById('audio-playback');

// Web Audio & Recording Variables
let audioCtx, analyser, dataArray, source;
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Canvas setup
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
canvasCtx.fillStyle = '#121215'; 
canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

btnStart.addEventListener('click', async () => {
    if (audioCtx && audioCtx.state === 'running') return;

    try {
        statusText.textContent = "Requesting access...";
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        statusText.textContent = "Microphone Connected and Active!";
        statusText.style.color = "var(--lavender-glow)";
        btnStart.textContent = "Mic is Live";
        btnStart.style.background = "#2e7d32"; 
        btnStart.style.cursor = "default";

        // Enable the Record Button
        btnRecord.classList.remove('disabled');
        btnRecord.disabled = false;

        // Initialize Audio Context for Visualizer
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        drawWaveform();

        // Initialize MediaRecorder for Playback Feature
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayback.src = audioUrl;
            audioPlayback.style.display = "block"; // Reveal the audio player
            audioChunks = []; // Reset for next recording
        };

    } catch (err) {
        console.error("Error accessing microphone:", err);
        statusText.textContent = "Access Denied. Please check your browser permissions.";
        statusText.style.color = "#ff5252";
    }
});

// Recording Button Toggle Logic
btnRecord.addEventListener('click', () => {
    if (!mediaRecorder) return;

    if (!isRecording) {
        // Start Recording
        audioChunks = [];
        mediaRecorder.start();
        isRecording = true;
        btnRecord.textContent = "Stop Recording";
        btnRecord.classList.add('active-record');
        audioPlayback.style.display = "none"; // Hide player while recording
    } else {
        // Stop Recording
        mediaRecorder.stop();
        isRecording = false;
        btnRecord.textContent = "Record New Audio";
        btnRecord.classList.remove('active-record');
    }
});

// The Animation Loop
function drawWaveform() {
    requestAnimationFrame(drawWaveform);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#121215'; 
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = '#b388ff'; 
    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / analyser.frequencyBinCount;
    let x = 0;

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0; 
        const y = v * HEIGHT / 2;

        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);

        x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}