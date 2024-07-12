document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector(":root");
    const rootstyle = window.getComputedStyle(root);
    let colors = {
        main_color : rootstyle.getPropertyValue('--main-color'),
        secondary_color : rootstyle.getPropertyValue('--secondary-color'),
        focus_color : rootstyle.getPropertyValue('--focus-color'),
        font_color : rootstyle.getPropertyValue('--font-color'),
        main_color_dark : rootstyle.getPropertyValue('--main-color-dark'),
        font_color_dark : rootstyle.getPropertyValue('--font-color-dark')
    }
    const modeswitcher = document.getElementById('switchMode');
    let mode
    if(localStorage.getItem("mode")){
        mode = localStorage.getItem("mode")
        setcolor()
    }
    else{
        mode = "Light"
        localStorage.setItem("mode", "Light");
    }
    
    function setcolor(){
        if(mode == 'Light'){
            root.style.setProperty('--main-color', colors.main_color);
            root.style.setProperty('--font-color', colors.font_color);
            modeswitcher.innerText = 'Light mode';
        }
        else{
            root.style.setProperty('--main-color', colors.main_color_dark);
            root.style.setProperty('--font-color', colors.font_color_dark);
            modeswitcher.innerText = 'Dark mode';
        }
    }
    
    function colorchange () {
        if(mode == 'Light'){
            root.style.setProperty('--main-color', colors.main_color_dark);
            root.style.setProperty('--font-color', colors.font_color_dark);
            modeswitcher.innerText = 'Light mode';
            mode = 'Dark';
            localStorage.setItem("mode", "Dark");
        }
        else{
            root.style.setProperty('--main-color', colors.main_color);
            root.style.setProperty('--font-color', colors.font_color);
            modeswitcher.innerText = 'Dark mode';
            mode = 'Light';
            localStorage.setItem("mode", "Light");
        }
    }

    document.getElementById('logButton').addEventListener('click', () => {
        window.electron.log('Button clicked');
    });
    modeswitcher.addEventListener('click', () => {
        //window.electron.log(colors)
        colorchange()
    });

    window.electron.log('Renderer process loaded');
});


