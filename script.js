const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const gallery = document.getElementById('gallery');
const filters = document.getElementById('filters');
const ctx = canvas.getContext('2d');

// ক্যামেরা অ্যাক্সেস শুরু করা
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Camera access denied or unavailable:', err);
        alert('Please allow camera access to use this feature.');
    });


// Capture and display image
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = filters.value; // Apply selected filter
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    addToGallery();
});

// Download image
downloadButton.addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'captured-image.png';
    link.click();
});

// Add image to gallery
function addToGallery() {
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    gallery.appendChild(img);
}

// Apply Filters Dynamically
const filters = document.getElementById('filters');
filters.addEventListener('change', () => {
    video.style.filter = filters.value;
});

// Timer for auto capture
function startTimer(seconds) {
    setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.filter = filters.value;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        addToGallery();
    }, seconds * 1000);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Dark Mode CSS
document.body.classList.add('dark-mode'); // Default
