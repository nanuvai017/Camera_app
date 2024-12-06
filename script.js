// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const startRecordingButton = document.getElementById('startRecordingButton');
const stopRecordingButton = document.getElementById('stopRecordingButton');
const downloadVideoButton = document.getElementById('downloadVideoButton');
const switchCameraButton = document.getElementById('switchCamera');
const filterSelect = document.getElementById('filterSelect');
const loadingScreen = document.getElementById('loadingScreen');
const pipButton = document.getElementById('pipButton');

// Global Variables
let mediaStream;
let mediaRecorder;
let recordedChunks = [];
let currentFilter = '';

// Get User Media
async function startCamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = mediaStream;
        loadingScreen.style.display = 'none';
    } catch (error) {
        alert('Error accessing camera: ' + error.message);
    }
}

// Switch Camera
let isBackCamera = false;
switchCameraButton.addEventListener('click', () => {
    isBackCamera = !isBackCamera;
    const constraints = isBackCamera
        ? { video: { facingMode: "environment" }, audio: true }
        : { video: { facingMode: "user" }, audio: true };

    stopCamera();
    startCamera(constraints);
});

// Apply Filter
function applyFilter(filter) {
    video.style.filter = filter;
    currentFilter = filter;
}

// Capture Image
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/png');

    const imgElement = document.createElement('img');
    imgElement.src = image;
    document.getElementById('capturedImagesContainer').appendChild(imgElement);
});

// Start Recording
startRecordingButton.addEventListener('click', () => {
    recordedChunks = [];
    const options = { mimeType: 'video/webm; codecs=vp8' };
    mediaRecorder = new MediaRecorder(mediaStream, options);

    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        downloadVideoButton.href = videoUrl;
        downloadVideoButton.download = 'recorded_video.webm';
        downloadVideoButton.style.display = 'block';
    };

    mediaRecorder.start();
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'block';
});

// Stop Recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordingButton.style.display = 'block';
    stopRecordingButton.style.display = 'none';
});

// Picture-in-Picture
pipButton.addEventListener('click', () => {
    if (video !== document.pictureInPictureElement) {
        video.requestPictureInPicture();
    } else {
        document.exitPictureInPicture();
    }
});

// Start Camera when page loads
startCamera();
                    
