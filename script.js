let videoElement = document.getElementById('video');
let canvasElement = document.getElementById('canvas');
let captureButton = document.getElementById('captureButton');
let downloadButton = document.getElementById('downloadButton');
let filterSelect = document.getElementById('filterSelect');
let pipButton = document.getElementById('pipButton');
let startRecordingButton = document.getElementById('startRecordingButton');
let stopRecordingButton = document.getElementById('stopRecordingButton');
let permissionRequest = document.getElementById('permissionRequest');
let cameraContainer = document.querySelector('.camera-container');
let controls = document.querySelector('.controls');
let filterDropdown = document.querySelector('.filter-dropdown');
let pipContainer = document.querySelector('.pip-container');

let currentStream;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

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
        filterDropdown.style.display = 'block';
        pipContainer.style.display = 'block';
    } catch (err) {
        console.error('Error accessing webcam: ', err);
        alert('Could not access webcam');
    }
}

// Apply filter to video
function applyFilter(filterValue) {
    videoElement.style.filter = filterValue;
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

    // Append captured image below
    document.getElementById('capturedImagesContainer').appendChild(imgElement);
    downloadButton.style.display = 'block'; // Show download button
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

        // Display recorded video below
        document.getElementById('capturedVideosContainer').appendChild(videoElement);

        // Create a download link for the recorded video
        let downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'recorded-video.webm';
        downloadLink.textContent = 'Download Video';
        document.getElementById('capturedVideosContainer').appendChild(downloadLink);
    };

    mediaRecorder.start();
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'block';
}

// Stop recording video
function stopRecording() {
    mediaRecorder.stop();
    startRecordingButton.style.display = 'block';
    stopRecordingButton.style.display = 'none';
}

// PiP Mode (Picture-in-Picture)
async function enablePiP() {
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await videoElement.requestPictureInPicture();
        }
    } catch (err) {
        console.error('Error in PiP mode: ', err);
    }
}

// Download captured image
downloadButton.addEventListener('click', function() {
    let imageDataUrl = canvasElement.toDataURL('image/png');
    let link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = 'captured-image.png';
    link.click();
});

// Event Listeners for buttons
captureButton.addEventListener('click', captureImage);
startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);
pipButton.addEventListener('click', enablePiP);

// Event listener for Allow Button
document.getElementById('allowButton').addEventListener('click', startCamera);
