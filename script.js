let videoElement = document.getElementById('video');
let canvasElement = document.getElementById('canvas');
let captureButton = document.getElementById('captureButton');
let downloadButton = document.getElementById('downloadButton');
let pipButton = document.getElementById('pipButton');
let startRecordingButton = document.getElementById('startRecordingButton');
let stopRecordingButton = document.getElementById('stopRecordingButton');
let permissionRequest = document.getElementById('permissionRequest');
let cameraContainer = document.querySelector('.camera-container');
let controls = document.querySelector('.controls');
let capturedContentContainer = document.getElementById('capturedContentContainer');
let filterSelect = document.getElementById('filterSelect');

let currentStream;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let videoStartTime;

// Function to start camera
async function startCamera() {
    try {
        // Ask for camera permissions
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = currentStream;

        // Hide the permission request and show the camera UI
        permissionRequest.style.display = 'none';
        cameraContainer.style.display = 'block';
        controls.style.display = 'block';
        pipButton.style.display = 'block';
        filterSelect.style.display = 'block';
    } catch (err) {
        console.error('Error accessing webcam: ', err);
        alert('Could not access webcam. Please grant permission to access your camera.');
    }
}

// Capture image from video
function captureImage() {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    let ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    let imageDataUrl = canvasElement.toDataURL('image/png');
    let imgElement = document.createElement('img');
    imgElement.src = imageDataUrl;

    // Append captured image to the content container
    let imageContainer = document.createElement('div');
    imageContainer.classList.add('captured-item');
    imageContainer.appendChild(imgElement);

    capturedContentContainer.appendChild(imageContainer);
    capturedContentContainer.style.display = 'block'; // Show content section
    downloadButton.style.display = 'block'; // Show download button

    // Enable download button for the captured image
    downloadButton.onclick = function() {
        let link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = 'captured-image.png';
        link.click();
    };
}

// Start recording video
function startRecording() {
    recordedChunks = [];
    let options = { mimeType: 'video/webm' };
    mediaRecorder = new MediaRecorder(currentStream, options);

    mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = function() {
        let blob = new Blob(recordedChunks, { type: 'video/webm' });
        let videoURL = URL.createObjectURL(blob);

        let videoElement = document.createElement('video');
        videoElement.src = videoURL;
        videoElement.controls = true;

        // Display recorded video in the content container
        let videoContainer = document.createElement('div');
        videoContainer.classList.add('captured-item');
        videoContainer.appendChild(videoElement);

        capturedContentContainer.appendChild(videoContainer);
        capturedContentContainer.style.display = 'block'; // Show content section

        // Create a download link for the recorded video
        let downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'recorded-video.webm';
        downloadLink.textContent = 'Download Video';
        videoContainer.appendChild(downloadLink);
    };

    mediaRecorder.start();
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'inline-block';
}

// Stop recording video
function stopRecording() {
    mediaRecorder.stop();
    startRecordingButton.style.display = 'inline-block';
    stopRecordingButton.style.display = 'none';
}

// Enable Picture-in-Picture mode
function enablePiP() {
    videoElement.requestPictureInPicture();
}

// Apply selected filter to the video
function applyFilter(filterValue) {
    videoElement.style.filter = filterValue;
}

// Event listeners
document.getElementById('allowButton').addEventListener('click', startCamera);
captureButton.addEventListener('click', captureImage);
startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);
pipButton.addEventListener('click', enablePiP);

        
