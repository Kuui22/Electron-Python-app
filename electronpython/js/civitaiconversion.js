function send(str) {
    window.electron.sendPython(str)
}
function generateRequest (name,link,modeltype){
    name = name.replace(/['"<>\\/:?&%;='()+{}[\]|$`]/g, '');
    //pipe = pipe.replace(/['"<>\\/:?&%;='()+{}[\]|$`]/g, '');
    //link = link.replace(/['"<>\\&%;='()+{}[\]|$`]/g, '');
    let request = `{"name":"${name}","link":"${link}","type":"${modeltype}"}`
    
    return request

}

document.addEventListener('DOMContentLoaded', () => {

    window.electron.startPythonCivitAI();

    let form = document.querySelector(".downloadform");
    form.addEventListener("submit", function (e) {
        e.preventDefault()
        let modeltype
        const selectedOption = document.querySelector('.custom-option.selected');
        if (selectedOption) {
            //window.electron.log(selectedOption.textContent); // Outputs the text of the selected option
            modeltype = selectedOption.textContent
        }
        let formdata = new FormData(this);
        let name = formdata.get("modelname");
        let link = formdata.get("modellink");
        //generate string and send it to python
        if (name && link && modeltype) {
            input = generateRequest(name,link,modeltype)
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