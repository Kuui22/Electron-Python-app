
function send(str) {
    window.electron.sendPython(str)
}

function generateRequest (prompt,height,width,steps,guidance){
    prompt = prompt.replace(/['"<>\\/&%;='()+{}[\]|$`]/g, '');
    let request = `{"prompt":"${prompt}","height":${height},"width":${width},"steps":${steps},"guidance":${guidance}}`
    
    return request

}

/*function startPythonCheck() {
    window.electron.startPythongen();

    pythonCheckInterval = setInterval(() => {
        window.electron.log("Checking if Python is up..."); 
        console.log(global.pythonActive)
        if(global.pythonActive){
            window.electron.log("Python is active.")
        }

    }, 1000); // Check every second
}*/

//when loaded, launch python and wait the user to submit the prompt
document.addEventListener('DOMContentLoaded', () => {

    window.electron.startPythongen();
    //startPythonCheck()

    let form = document.querySelector(".promptform");
    form.addEventListener("submit", function (e) {
        e.preventDefault()
        //set default values here with || x
        let formdata = new FormData(this);
        let prompt = formdata.get("prompt");
        let height = formdata.get("height") || 1024;
        let width = formdata.get("width") || 768;
        let steps = formdata.get("steps") || 28;
        let guidance = formdata.get("guidance") || 7;
        //generate string and send it to python
        if (prompt) {
            input = generateRequest(prompt,height,width,steps,guidance)
            send(input)
        }
        else {
            window.electron.log("Empty prompt!")
        }
    });
});

window.addEventListener('beforeunload', () => {
    window.electron.killPython();
    window.electron.log("Killed Python!")
});