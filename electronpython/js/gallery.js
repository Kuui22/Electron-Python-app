async function loadImages() {
    const directory = '/images'; // Update with your images folder path
    const images = await window.imageAPI.getImagesFromDirectory(directory);
    return images;
}

async function initializeGallery() {
    const images = await loadImages();
    let currentIndex = 0;

    function showImage(index) {
        const imageElement = document.getElementById('gallery-image');
        imageElement.src = images[index];
    }

    function previousImage() {
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        showImage(currentIndex);
    }

    function nextImage() {
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        showImage(currentIndex);
    }

    document.getElementById('gallery-left').addEventListener('click', previousImage);
    document.getElementById('gallery-right').addEventListener('click', nextImage);

    // Show the first image initially
    showImage(currentIndex);
}
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
});