const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const filterSelect = document.getElementById("filterSelect");
const capturedImagesContainer = document.getElementById("capturedImagesContainer");
const startRecordingButton = document.getElementById("startRecordingButton");
const stopRecordingButton = document.getElementById("stopRecordingButton");
const downloadVideoButton = document.getElementById("downloadVideoButton");
let mediaRecorder;
let recordedChunks = [];

// Start webcam
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
        echoCancellation: true,
        noiseSuppression: true
    }
}).then((stream) => {
    video.srcObject = stream;
    video.play();

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
}).catch((error) => console.error("Error accessing webcam: ", error));

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
    startRecordingButton.style.display = "none";
    stopRecordingButton.style.display = "inline";
});

// Stop recording
stopRecordingButton.addEventListener("click", () => {
    mediaRecorder.stop();
    startRecordingButton.style.display = "inline";
    stopRecordingButton.style.display = "none";
});

// Picture-in-Picture
document.getElementById("pipButton").addEventListener("click", async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        await video.requestPictureInPicture();
    }
});
                                                      
