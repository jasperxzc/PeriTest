// DOM Elements
const btnStart = document.getElementById('start-cam');
const statusText = document.getElementById('cam-status');
const videoFeed = document.getElementById('webcam-feed');
const btnSnapshot = document.getElementById('snapshot-btn');
const snapshotCanvas = document.getElementById('snapshot-canvas');
const canvasCtx = snapshotCanvas.getContext('2d');

let mediaStream = null;

btnStart.addEventListener('click', async () => {
    // Prevent multiple requests if already running
    if (mediaStream) return;

    try {
        statusText.textContent = "Requesting access...";
        statusText.style.color = "var(--text-main)";

        // Request video access from the browser
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
        statusText.textContent = "Webcam Connected and Active!";
        statusText.style.color = "var(--lavender-glow)";
        btnStart.textContent = "Camera is Live";
        btnStart.style.background = "#2e7d32"; 
        btnStart.style.cursor = "default";

        // Route the stream to the HTML5 video element
        videoFeed.srcObject = mediaStream;

        // Enable the Snapshot Button
        btnSnapshot.classList.remove('disabled');
        btnSnapshot.disabled = false;

    } catch (err) {
        console.error("Error accessing webcam:", err);
        statusText.textContent = "Access Denied or Webcam Not Found. Check browser permissions.";
        statusText.style.color = "#ff5252";
    }
});

// Snapshot Logic
btnSnapshot.addEventListener('click', () => {
    if (!mediaStream) return;

    // Set canvas dimensions to match the actual video resolution
    snapshotCanvas.width = videoFeed.videoWidth;
    snapshotCanvas.height = videoFeed.videoHeight;

    // Draw the current video frame onto the canvas
    // We flip the context horizontally so the snapshot matches the mirrored video feed
    canvasCtx.translate(snapshotCanvas.width, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(videoFeed, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

    // Display the snapshot below the button
    snapshotCanvas.style.display = "block";
});