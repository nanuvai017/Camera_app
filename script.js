// Get the video element, canvas element, and capture button
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');

// Access the user's webcam and display it on the video element
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;
    })
    .catch(function(error) {
        console.error('Error accessing the camera: ', error);
    });

// Capture the image when the button is clicked
captureButton.addEventListener('click', function() {
    // Set canvas size equal to the video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas and convert it to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Display the captured image in the result div
    resultDiv.innerHTML = `<img src="${dataUrl}" alt="Captured Image" />`;
});

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
