let mode
async function checkMode() {
    if(window.dexie.modeExists()){
        //let x = window.dexie.modeExists()
        window.electron.log(x) 
    }
    //const data = {id:1, current: 'example mode' };
    //await window.dexie.addData(data);
    
}
async function addData(){
    const data = {id:1, current: 'example mode' };
    await window.dexie.addData(data);
}
//checkMode()
async function getData(){
    const allModes = await window.dexie.getAllData();
    window.electron.log(allModes);
    console.log(allModes);
}
async function updateMode(newMode){
    await window.dexie.updateCurrentMode(newMode);
}
async function clearData(){
    await window.dexie.clearData();
}


document.addEventListener('DOMContentLoaded', () => {
    
    //target root and his style
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
    //check current mode and set colors fitting it
    const modeswitcher = document.getElementById('switchMode');
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
            modeswitcher.innerText = 'Dark mode';
        }
        else{
            root.style.setProperty('--main-color', colors.main_color_dark);
            root.style.setProperty('--font-color', colors.font_color_dark);
            modeswitcher.innerText = 'Light mode';
        }
    }
    //this flips the colors
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
        //window.electron.log('Button clicked');
        //updateMode(0,localStorage.getItem("mode"));
        getData();
    });
    document.getElementById('addButton').addEventListener('click', () => {
        checkMode();
    });
    document.getElementById('clearButton').addEventListener('click', () => {
        clearData();
    });
    //click on the mode button
    modeswitcher.addEventListener('click', () => {
        //window.electron.log(colors)
        colorchange()
    });

    window.electron.log('Renderer process loaded');
});


