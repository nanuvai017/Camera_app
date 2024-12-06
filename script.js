let videoElement = document.getElementById('video');
let canvasElement = document.getElementById('canvas');
let captureButton = document.getElementById('captureButton');
let downloadButton = document.getElementById('downloadButton');
let filterSelect = document.getElementById('filterSelect');
let pipButton = document.getElementById('pipButton');
let startRecordingButton = document.getElementById('startRecordingButton');
let stopRecordingButton = document.getElementById('stopRecordingButton');
let capturedVideosContainer = document.getElementById('capturedVideosContainer');

let currentStream;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

// Start camera function
async function startCamera() {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = currentStream;
        document.getElementById('loadingScreen').style.display = 'none'; // Hide loading screen
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
    capturedVideosContainer.appendChild(imgElement);
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
        capturedVideosContainer.appendChild(videoElement);

        // Create a download link for the recorded video
        let downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'recorded-video.webm';
        downloadLink.textContent = 'Download Video';
        capturedVideosContainer.appendChild(downloadLink);
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

// Switch camera (front/back)
async function switchCamera() {
    let videoTracks = currentStream.getVideoTracks();
    let newStream;

    if (videoTracks[0].label.includes('front')) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
    } else {
        newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    }

    // Stop the previous video track
    videoTracks[0].stop();

    // Set the new video stream
    videoElement.srcObject = newStream;
    currentStream = newStream;
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
switchCameraButton.addEventListener('click', switchCamera);

// Start camera when page loads
startCamera();
                                                                        
