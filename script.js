const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const filterSelect = document.getElementById('filter');
const gallery = document.getElementById('gallery');
const timerDisplay = document.getElementById('timer');
const shareButtons = document.getElementById('share-buttons');
const shareFacebookButton = document.getElementById('share-facebook');
const shareWhatsappButton = document.getElementById('share-whatsapp');
const frontCameraButton = document.getElementById('front-camera');
const backCameraButton = document.getElementById('back-camera');

const ctx = canvas.getContext('2d');
let currentStream = null;

function startCamera(facingMode = 'user') {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
    })
    .then(stream => {
        currentStream = stream;
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera:", err);
    });
}

// Start with front camera
startCamera('user');

// Switch to front camera
frontCameraButton.addEventListener('click', () => {
    startCamera('user');
});

// Switch to back camera
backCameraButton.addEventListener('click', () => {
    startCamera('environment');
});

// Capture Image
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = filterSelect.value;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show Download Button
    downloadButton.style.display = 'inline-block';
    // Show Share Buttons
    shareButtons.style.display = 'flex';
});

// Download Image
downloadButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'captured-image.png';
    link.click();

    // Add image to gallery
    const img = document.createElement('img');
    img.src = imageURL;
    gallery.appendChild(img);
});

// Share on Facebook
shareFacebookButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageURL)}`;
    window.open(facebookShareURL, '_blank');
});

// Share on WhatsApp
shareWhatsappButton.addEventListener('click', () => {
    const imageURL = canvas.toDataURL('image/png');
    const whatsappShareURL = `https://wa.me/?text=${encodeURIComponent(imageURL)}`;
    window.open(whatsappShareURL, '_blank');
});
