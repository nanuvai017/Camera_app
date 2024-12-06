const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const filterSelect = document.getElementById("filterSelect");
const capturedImagesContainer = document.getElementById("capturedImagesContainer");
const startRecordingButton = document.getElementById("startRecordingButton");
const stopRecordingButton = document.getElementById("stopRecordingButton");
const downloadVideoButton = document.getElementById("downloadVideoButton");
const loadingScreen = document.getElementById("loadingScreen");
const switchCameraButton = document.getElementById("switchCamera");
let mediaRecorder;
let recordedChunks = [];
let isFrontCamera = true;

// Hide loading screen after camera starts
function hideLoadingScreen() {
    loadingScreen.style.display = "none";
}

// Start webcam
async function startWebcam() {
    const constraints = {
        video: { facingMode: isFrontCamera ? "user" : "environment" },
        audio: { echoCancellation: true, noiseSuppression: true }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
    hideLoadingScreen();

    // Set up MediaRecorder for video recording
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        downloadVideoButton.href = url;
        downloadVideoButton.style.display = "inline";
        downloadVideoButton.innerHTML = "Download Video";
    };
}

// Apply filter
function applyFilter(filter) {
    video.style.filter = filter;
}

// Capture image
document.getElementById("captureButton").addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = video.style.filter || "none";
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    capturedImagesContainer.appendChild(img);
});

// Start recording
startRecordingButton.addEventListener("click", () => {
    recordedChunks = [];
    mediaRecorder.start();
    startRecordingButton.classList.add("hidden");
    stopRecordingButton.classList.remove("hidden");
});

// Stop recording
stopRecordingButton.addEventListener("click", () => {
    mediaRecorder.stop();
    startRecordingButton.classList.remove("hidden");
    stopRecordingButton.classList.add("hidden");
});

// Switch camera
switchCameraButton.addEventListener("click", () => {
    isFrontCamera = !isFrontCamera;
    startWebcam();
});

// Picture-in-Picture
document.getElementById("pipButton").addEventListener("click", async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        await video.requestPictureInPicture();
    }
});

// Start the webcam on page load
startWebcam();
        
