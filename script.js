const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const filterSelect = document.getElementById('filter');
const frameSelect = document.getElementById('frame');
const timerInput = document.getElementById('timer');
const setTimerButton = document.getElementById('setTimer');
const enableDrawingButton = document.getElementById('enableDrawing');
const clearDrawingButton = document.getElementById('clearDrawing');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const result = document.getElementById('result');
const gallery = document.getElementById('gallery');
let drawingMode = false;

// Start camera feed
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Camera access denied or unavailable:', err);
        alert('Please allow camera access to use this feature.');
    });

// Apply filters
filterSelect.addEventListener('change', () => {
    video.style.filter = filterSelect.value;
});

// Apply frames
frameSelect.addEventListener('change', () => {
    video.style.border = frameSelect.value === 'none' ? 'none' : '10px solid black';
    if (frameSelect.value === 'circle') {
        video.style.borderRadius = '50%';
    } else {
        video.style.borderRadius = '0';
    }
});

// Drawing mode
enableDrawingButton.addEventListener('click', () => {
    drawingMode = true;
    clearDrawingButton.style.display = 'block';
});

clearDrawingButton.addEventListener('click', () => {
    drawingMode = false;
    clearDrawingButton.style.display = 'none';
});

// Capture image
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png');
    result.innerHTML = `<img src="${imageDataURL}" alt="Captured Image"/>`;

    // Add to gallery
    const img = document.createElement('img');
    img.src = imageDataURL;
    gallery.appendChild(img);

    // Enable download button
    downloadButton.style.display = 'block';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = imageDataURL;
        a.download = 'captured-image.png';
        a.click();
    };
});

// Timer
setTimerButton.addEventListener('click', () => {
    const seconds = parseInt(timerInput.value);
    if (seconds > 0) {
        setTimeout(() => {
            captureButton.click();
        }, seconds * 1000);
    }
});
