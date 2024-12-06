const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const downloadButton = document.getElementById('downloadButton');
const filters = document.querySelectorAll('.filter');
const ctx = canvas.getContext('2d');
let currentFilter = 'none';
let currentStream;

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
    // Resize canvas to 4K or 8K resolution
    const desiredWidth = 3840; // 4K width
    const desiredHeight = 2160; // 4K height
    
    // Resize the canvas to the new resolution
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;

    // Draw the video image onto the canvas at the new resolution
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply the selected filter (optional)
    ctx.filter = currentFilter; // Apply the selected filter
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Display captured image (in high resolution)
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

// Apply Filters
filters.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.id.replace('filter-', '').toLowerCase();
        console.log("Selected Filter:", currentFilter);
    });
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
