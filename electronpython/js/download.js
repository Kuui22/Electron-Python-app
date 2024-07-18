function send(str) {
    window.electron.sendPython(str)
}
function generateRequest (name,link,pipe){
    name = name.replace(/['"<>\\/:?&%;='()+{}[\]|$`]/g, '');
    pipe = pipe.replace(/['"<>\\/:?&%;='()+{}[\]|$`]/g, '');
    //link = link.replace(/['"<>\\&%;='()+{}[\]|$`]/g, '');
    let request = `{"name":"${name}","link":"${link}","pipe":"${pipe}"}`
    
    return request

}

document.addEventListener('DOMContentLoaded', () => {

    window.electron.startPythonDownload();

    let form = document.querySelector(".downloadform");
    form.addEventListener("submit", function (e) {
        e.preventDefault()
        let formdata = new FormData(this);
        let name = formdata.get("modelname");
        let link = formdata.get("modellink");
        let pipe = formdata.get("modelpipe");
        //generate string and send it to python
        if (name && link && pipe) {
            input = generateRequest(name,link,pipe)
            window.electron.log(input)
            send(input)
        }
        else {
            window.electron.log("Link or name are empty!")
        }
    });
});

window.addEventListener('beforeunload', () => {
    window.electron.killPython();
    window.electron.log("Killed Python!")
});