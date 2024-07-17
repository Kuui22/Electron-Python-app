function send(str) {
    window.electron.sendPython(str)
}
function generateRequest (name,link){
    name = name.replace(/['"<>\\/:?&%;='()+{}[\]|$`]/g, '');
    //link = link.replace(/['"<>\\&%;='()+{}[\]|$`]/g, '');
    let request = `{"name":"${name}","link":${link}}`
    
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
        //generate string and send it to python
        if (name && link) {
            input = generateRequest(name,link)
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