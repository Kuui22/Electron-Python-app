
function send(str) {
    //window.electron.testboth(str)
    window.electron.sendPython(str)
}

function generateRequest (prompt,height,width,steps,guidance){
    let request = `{prompt:${prompt},height:${height},width:${width},steps:${steps},guidance:${guidance}}`
    
    return request

}

//when loaded, launch python and wait the user to submit the prompt
document.addEventListener('DOMContentLoaded', () => {
    window.electron.startPython()
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