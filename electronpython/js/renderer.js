let mode

//this checks the display mode (Light or Dark mode) in the indexedDB using dexie
async function checkMode() {
    return window.dexie.modeExists().then((value) => {
        window.electron.log(value);
        if (value && value == "Light" || value == "Dark") {
            //window.electron.log("true");
            mode = value;
        }
        else {//default
            //window.electron.log("false");
            addData()
            updateMode("Dark");
            mode = "Dark"
        }
    });
}

//base function to add an index to indexedDB if it's the first time launching the app
async function addData() {
    const data = { id: 1, current: 'Dark' };
    await window.dexie.addData(data);
}
async function getData() {
    const allModes = await window.dexie.getAllData();
    window.electron.log(allModes);
    console.log(allModes);
}

//updates the mode from indexedDB when changed
async function updateMode(newMode) {
    await window.dexie.updateCurrentMode(newMode);
}
//don't use it....
async function clearData() {
    await window.dexie.clearData();
}


document.addEventListener('DOMContentLoaded', () => {

    //target root and his style
    const root = document.querySelector(":root");
    const rootstyle = window.getComputedStyle(root);

    let colors = {
        main_color: rootstyle.getPropertyValue('--main-color'),
        secondary_color: rootstyle.getPropertyValue('--secondary-color'),
        focus_color: rootstyle.getPropertyValue('--focus-color'),
        font_color: rootstyle.getPropertyValue('--font-color'),
        main_color_dark: rootstyle.getPropertyValue('--main-color-dark'),
        secondary_color_dark: rootstyle.getPropertyValue('--secondary-color-dark'),
        font_color_dark: rootstyle.getPropertyValue('--font-color-dark')
    }
    //check current mode and set colors fitting it
    const modeswitcher = document.getElementById('switchMode');
    const logbutton = document.getElementById('logButton');
    const checkbutton = document.getElementById('checkButton');
    checkMode().finally(() => {
        setcolor();
    });
    //this sets the color (called above when entering the page)
    function setcolor() {
        if (mode == 'Light') {
            root.style.setProperty('--main-color', colors.main_color);
            root.style.setProperty('--font-color', colors.font_color);
            root.style.setProperty('--secondary-color', colors.secondary_color);
            modeswitcher.innerText = 'Dark mode';
        }
        else {
            root.style.setProperty('--main-color', colors.main_color_dark);
            root.style.setProperty('--font-color', colors.font_color_dark);
            root.style.setProperty('--secondary-color', colors.secondary_color_dark);
            modeswitcher.innerText = 'Light mode';
        }
    }
    //this flips the colors
    function colorchange() {
        if (mode == 'Light') {
            root.style.setProperty('--main-color', colors.main_color_dark);
            root.style.setProperty('--font-color', colors.font_color_dark);
            root.style.setProperty('--secondary-color', colors.secondary_color_dark);
            modeswitcher.innerText = 'Light mode';
            mode = 'Dark';
            updateMode("Dark");
        }
        else {
            root.style.setProperty('--main-color', colors.main_color);
            root.style.setProperty('--font-color', colors.font_color);
            root.style.setProperty('--secondary-color', colors.secondary_color);
            modeswitcher.innerText = 'Dark mode';
            mode = 'Light';
            updateMode("Light");
        }
    }

    logbutton.addEventListener('click', () => {
        //window.electron.log('Button clicked');
        //updateMode(0,localStorage.getItem("mode"));
        getData();
    });
    checkbutton?.addEventListener('click', () => {
        checkMode();
    });
    //click on the mode button
    modeswitcher.addEventListener('click', () => {
        //window.electron.log(colors)
        colorchange()
    });
    /*document.getElementById('clearButton').addEventListener('click', () => {
        clearData();
    });*/
    window.electron.log('Renderer process loaded');
});


