document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logButton').addEventListener('click', () => {
        window.electron.log('Button clicked');
    });

    window.electron.log('Renderer process loaded');
});