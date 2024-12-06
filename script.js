// Get the video element
const video = document.getElementById('video');

// Apply selected filter to video
function applyFilter(filter) {
    video.style.filter = filter;
}

// Start webcam access
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        document.getElementById('loadingScreen').style.display = 'none';
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });

// Capture button functionality
document.getElementById('captureButton').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Display captured image below
    const dataUrl = canvas.toDataURL('image/png');
    const img = new Image();
    img.src = dataUrl;
    const container = document.getElementById('capturedImagesContainer');
    container.appendChild(img);
});

// Download captured image
document.getElementById('downloadButton').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'captured-image.png';
    link.click();
});

// Switch camera functionality
document.getElementById('switchCamera').addEventListener('click', () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
            const currentStream = video.srcObject;
            const tracks = currentStream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: videoDevices[1].deviceId } } })
                .then(stream => {
                    video.srcObject = stream;
                })
                .catch(err => console.error("Error switching camera: ", err));
        }
    });
});

// Picture-in-Picture (PiP) feature
document.getElementById('pipButton').addEventListener('click', () => {
    if (video !== null) {
        video.requestPictureInPicture().catch(error => console.error("Error entering PiP mode: ", error));
    }
});
    
