// Loading Screen
document.getElementById('loadingScreen').style.display = 'flex';

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        document.getElementById('video').srcObject = stream;
        document.getElementById('loadingScreen').style.display = 'none';
    })
    .catch(err => console.log("Error accessing camera: ", err));

// Switch Camera
document.getElementById('switchCamera').addEventListener('click', () => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const currentStream = document.getElementById('video').srcObject;
            const tracks = currentStream.getTracks();
            tracks.forEach(track => track.stop());
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: videoDevices[1].deviceId } } })
                .then(stream => {
                    document.getElementById('video').srcObject = stream;
                });
        });
});

// Capture Image
document.getElementById('captureButton').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
});

// Download Image
document.getElementById('downloadButton').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'captured_image.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Apply Filter
function applyFilter(filter) {
    document.getElementById('video').style.filter = filter;
}

// Video Speed Control
function changeSpeed() {
    const video = document.getElementById('video');
    video.playbackRate = document.getElementById('speedControl').value;
}

// Picture-in-Picture
document.getElementById('pipButton').addEventListener('click', () => {
    const video = document.getElementById('video');
    if (video.requestPictureInPicture) {
        video.requestPictureInPicture();
    }
});
