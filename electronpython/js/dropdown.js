async function getModels(directoryPath) {
    try {
        const folders = await window.electron.getModelsFolder(directoryPath);
        //window.electron.log(folders);
        return folders;
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }

}



document.addEventListener('DOMContentLoaded', function () {
    const customSelect = document.querySelector('.custom-select');
    const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
    const customOptions = customSelect.querySelector('.custom-options');
    
    const directoryPath = 'text-to-image';

    (async () => {
        try {
            
            const directoryNames = await getModels(directoryPath);
            console.log(directoryNames); // Now you have the result in `folders`
            // Populate the dropdown with directory names
            directoryNames.forEach(name => {
                const option = document.createElement('div');
                option.classList.add('custom-option');
                option.textContent = name;
                customOptions.appendChild(option);
            });
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
        } catch (error) {
            console.error('Error:', error);
        }
    })();




});

