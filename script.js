const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const filterSelect = document.getElementById('filter');
const gallery = document.getElementById('gallery');
const timerDisplay = document.getElementById('timer');
const drawingModeButton = document.getElementById('drawing-mode-toggle');
const darkModeButton = document.getElementById('dark-mode-toggle');
const shareButtons = document.getElementById('share-buttons');
const shareFacebookButton = document.getElementById('share-facebook');
const shareWhatsappButton = document.getElementById('share-whatsapp');

const ctx = canvas.getContext('2d');
let seconds = 0;
let minutes = 0;
let timerInterval;
let drawingMode = false;
let drawCtx;

// Start camera stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("ক্যামেরা অ্যাক্সেস করতে সমস্যা:", err);
    });

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        timerDisplay.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

startTimer();

// Capture Image
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = filterSelect.value;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show Download Button
    downloadButton.style.display = 'inline-block';
    // Show Share Buttons
    shareButtons.style.display = 'flex';
});

// Download Image
downloadButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'captured-image.png';
    link.click();

    // Add image to gallery
    const img = document.createElement('img');
    img.src = imageURL;
    gallery.appendChild(img);
});

// Dark Mode Toggle
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// For filters
filterSelect.addEventListener('change', () => {
    canvas.style.filter = filterSelect.value;
});

// Drawing Mode Toggle
drawingModeButton.addEventListener('click', () => {
    drawingMode = !drawingMode;
    if (drawingMode) {
        drawingModeButton.textContent = "ড্রইং মোড বন্ধ করুন";
        createDrawingCanvas();
    } else {
        drawingModeButton.textContent = "ড্রইং মোড চালু করুন";
        removeDrawingCanvas();
    }
});

// Create Drawing Canvas
function createDrawingCanvas() {
    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = 'drawing-mode-canvas';
    drawingCanvas.width = video.videoWidth;
    drawingCanvas.height = video.videoHeight;
    document.body.appendChild(drawingCanvas);
    drawCtx = drawingCanvas.getContext('2d');
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
}

// Remove Drawing Canvas
function removeDrawingCanvas() {
    const drawingCanvas = document.getElementById('drawing-mode-canvas');
    if (drawingCanvas) {
        drawingCanvas.remove();
    }
}

// Drawing function
let isDrawing = false;
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    drawCtx.lineWidth = 5;
    drawCtx.lineCap = 'round';
    drawCtx.strokeStyle = 'red';
    drawCtx.lineTo(e.clientX - video.offsetLeft, e.clientY - video.offsetTop);
    drawCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// Share on Facebook
shareFacebookButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageURL)}`;
    window.open(facebookShareURL, '_blank');
});

// Share on WhatsApp
shareWhatsappButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const whatsappShareURL = `https://wa.me/?text=${encodeURIComponent(imageURL)}`;
    window.open(whatsappShareURL, '_blank');
});
        
