const images = ['../images/marisa.jpg', '../images/Untitled.png', '../images/reimufumo.jpg'];
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

document.addEventListener('DOMContentLoaded', () => {
    const leftarrow = document.getElementById('gallery-left');
    const rightarrow = document.getElementById('gallery-right');

    leftarrow.addEventListener('click', () => {
        //window.electron.log(colors)
        previousImage()
    });
    rightarrow.addEventListener('click', () => {
        //window.electron.log(colors)
        nextImage()
    });
});