let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let captureButton = document.getElementById('captureButton');
let downloadButton = document.getElementById('downloadButton');
let startRecordingButton = document.getElementById('startRecordingButton');
let stopRecordingButton = document.getElementById('stopRecordingButton');
let filterSelect = document.getElementById('filterSelect');
let timerElement = document.getElementById('timer');
let recordedVideo = document.getElementById('recordedVideo');
let recordedBlob = null;
let mediaRecorder = null;
let stream;
let timer;
let seconds = 0;

// Access camera and display on video element
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(s => {
        stream = s;
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing webcam:', err);
    });

// Apply selected filter to video
function applyFilter(filter) {
    video.style.filter = filter;
}

// Capture image from video and show in canvas
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imgData = canvas.toDataURL('image/png');
    let img = new Image();
    img.src = imgData;
    document.getElementById('capturedImagesContainer').appendChild(img);
});

// Start video recording
startRecordingButton.addEventListener('click', () => {
    mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    
    mediaRecorder.ondataavailable = event => chunks.push(event.data);
    
    mediaRecorder.onstop = () => {
        recordedBlob = new Blob(chunks, { type: 'video/webm' });
        recordedVideo.src = URL.createObjectURL(recordedBlob);
        downloadButton.style.display = 'inline-block';
    };

    mediaRecorder.start();
    startTimer();
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'inline-block';
});

// Stop video recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    stopTimer();
    startRecordingButton.style.display = 'inline-block';
    stopRecordingButton.style.display = 'none';
});

// Download recorded video
downloadButton.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(recordedBlob);
    a.download = 'recorded_video.webm';
    a.click();
});

// Timer functionality
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

            
