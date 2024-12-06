let video = document.getElementById('video');
let stream;
let currentFacingMode = "user"; // Default front camera
let mediaRecorder;
let recordedChunks = [];

// Start Camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode
            },
            audio: {
                echoCancellation: true, // Prevent echo
                noiseSuppression: true, // Reduce background noise
            }
        });
        video.srcObject = stream; // Display video stream on video element
        document.getElementById('loadingScreen').style.display = 'none';
    } catch (err) {
        console.error('Error accessing webcam:', err);
        alert("Unable to access camera. Please allow camera permissions.");
    }
}

// Switch Camera
async function switchCamera() {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop current stream
    }
    startCamera(); // Restart camera with the new facing mode
}

// Capture Image
document.getElementById('captureButton').addEventListener('click', () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let image = canvas.toDataURL('image/png');
    let capturedImagesContainer = document.getElementById('capturedImagesContainer');
    let img = document.createElement('img');
    img.src = image;
    capturedImagesContainer.appendChild(img);
});

// Download Image
document.getElementById('downloadButton').addEventListener('click', () => {
    let canvas = document.getElementById('canvas');
    let image = canvas.toDataURL('image/png');
    let a = document.createElement('a');
    a.href = image;
    a.download = 'captured_image.png';
    a.click();
});

// Start Video Recording
document.getElementById('startRecordingButton').addEventListener('click', () => {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
        let blob = new Blob(recordedChunks, { type: 'video/webm' });
        let videoURL = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'recorded_video.webm';
        downloadLink.click();
    };
    mediaRecorder.start();
    document.getElementById('startRecordingButton').style.display = 'none';
    document.getElementById('stopRecordingButton').style.display = 'inline-block';
});

// Stop Video Recording
document.getElementById('stopRecordingButton').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('startRecordingButton').style.display = 'inline-block';
    document.getElementById('stopRecordingButton').style.display = 'none';
});

// Apply Filter
function applyFilter(filterValue) {
    video.style.filter = filterValue;
}

// PiP Mode
document.getElementById('pipButton').addEventListener('click', () => {
    if (video.requestPictureInPicture) {
        video.requestPictureInPicture();
    }
});

// Initialize camera on page load
document.addEventListener('DOMContentLoaded', () => {
    startCamera();
});

// Switch camera functionality
document.getElementById('switchCamera').addEventListener('click', switchCamera);
