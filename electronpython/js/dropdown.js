document.addEventListener('DOMContentLoaded', function () {
    const customSelect = document.querySelector('.custom-select');
    const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
    const customOptions = customSelect.querySelector('.custom-options');
    const customOptionsList = customOptions.querySelectorAll('.custom-option');

    customSelectTrigger.addEventListener('click', () => {
        //window.electron.log('Custom select trigger');
        customOptions.classList.toggle('closed');
        customOptions.classList.toggle('open');
        //console.log('Options class list:', customOptions.classList); // Debugging: Check class list
    });

    customOptionsList.forEach(option => {
        option.addEventListener('click', () => {
            customOptionsList.forEach(option => option.classList.remove('selected'));
            option.classList.add('selected');
            customSelectTrigger.querySelector('span').textContent = option.textContent;
            customOptions.classList.remove('open');
            customOptions.classList.add('closed')
        });
    });

    document.addEventListener('click', (event) => {
        if (!customSelect.contains(event.target)) {
            customOptions.classList.remove('open');
            customOptions.classList.add('closed')
        }
    });
});