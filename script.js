const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const downloadButton = document.getElementById('downloadButton');
const startRecordingButton = document.getElementById('startRecordingButton');
const stopRecordingButton = document.getElementById('stopRecordingButton');
const filterSelect = document.getElementById('filterSelect');
const ctx = canvas.getContext('2d');
let currentFilter = 'none';
let currentStream;
let mediaRecorder;
let recordedChunks = [];

// Access Camera Stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        currentStream = stream;
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing camera:", err);
    });

// Capture Image Function
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = currentFilter; // Apply the selected filter
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Display captured image
    const imgData = canvas.toDataURL('image/png');
    const result = document.createElement('img');
    result.src = imgData;
    document.body.appendChild(result);
});

// Download the captured image
downloadButton.addEventListener('click', () => {
    const imgData = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'captured-image.png';
    a.click();
});

// Change Filter when selected from dropdown
filterSelect.addEventListener('change', (event) => {
    currentFilter = event.target.value;
    console.log("Selected Filter:", currentFilter);
});

// Start Recording
startRecordingButton.addEventListener('click', () => {
    const stream = video.srcObject;
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = videoURL;
        a.download = 'recorded-video.webm';
        a.click();
        recordedChunks = []; // Reset the chunks array
    };

    mediaRecorder.start();
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'inline';
});

// Stop Recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordingButton.style.display = 'inline';
    stopRecordingButton.style.display = 'none';
});

// Switch Camera
document.getElementById('switchCamera').addEventListener('click', () => {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop()); // Stop the current stream
    }
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];
        navigator.mediaDevices.getUserMedia({ video: { deviceId: backCamera.deviceId } })
            .then(stream => {
                currentStream = stream;
                video.srcObject = stream;
            })
            .catch(err => {
                console.error("Error switching camera:", err);
            });
    });
});
