
function send(str) {
    //window.electron.testboth(str)
    window.electron.sendPython(str)
}



document.addEventListener('DOMContentLoaded', () => {
    window.electron.startPython()
    let form = document.querySelector(".promptform");
    form.addEventListener("submit", function (e) {
        e.preventDefault()
        let formdata = new FormData(this);
        let input = formdata.get("string_to_send");
        if (input) {
            send(input)
        }
        else {
            window.electron.log("Empty prompt!")
        }
    });
});