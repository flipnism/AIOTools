const _el = new EL(true);
const _ROOT = _el.mainparent(true, "googletool");
const btngroup = _el.makegroup(true);



const txtfield = _el.add(C.tf, "imagesearch", "", "search");
_el.attr(_ROOT, ["style", "width:100%;margin-top:10px;"]);
_el.attr(txtfield, ["style", "width:100%;"]);



_ROOT.appendChild(txtfield);
_ROOT.appendChild(btngroup)

_el.attachGroup(_ROOT);

function NavigatePage(_method) {
    sockSendMessage({
        fromserver: false,
        type: "navigate",
        data: JSON.stringify({
            method: _method
        })
    })
}
function ClickImage(id) {
    sockSendMessage({
        fromserver: false,
        type: "clickimage",
        data: JSON.stringify({
            method: "CLICK",
            page: id
        })
    })
}
async function btnKlikListener(e) {

    NavigatePage(e.target.textContent);
    if (e.target.textContent == "DOWNLOAD") {
        console.log("YES");
        await _delay(1000)
        console.log("LOADING");

        updateLoading(true);
    }
}


txtfield.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {

        sockSendMessage({
            fromserver: false,
            type: "searchongoogle",
            data: event.target.value
        })
    }
})


function appendButtons(count) {
    _el.clearShit(btngroup);
    const btnup = _el.add(C.btn, C.class_btn, "UP");
    const btnclose = _el.add(C.btn, C.class_btn, "CLOSE");
    const btndown = _el.add(C.btn, C.class_btn, "DOWN");
    const btndownload = _el.add(C.btn, C.class_btn, "DOWNLOAD");
    const dropdown = _el.add(C.picker, "imgpicker", "test");
    btngroup.appendChild(btnup);
    btngroup.appendChild(btndown);
    btngroup.appendChild(btnclose);
    btngroup.appendChild(dropdown);
    btngroup.appendChild(btndownload);
    btnup.addEventListener("click", btnKlikListener);
    btndown.addEventListener("click", btnKlikListener);
    btnclose.addEventListener("click", btnKlikListener);
    btndownload.addEventListener("click", btnKlikListener);
    _el.attr(dropdown, ["style", "flex:1;"]);
    Array.from(...Array(parseInt(count)).keys()).forEach((e) => {
        _el.appendMenuItem(dropdown, e);
    })
    dropdown.addEventListener("change", async (e) => {
        ClickImage(dropdown.selectedIndex);

    })
}

document.addEventListener("SOCKETMESSAGE", (ev) => {

    const result = ev.detail;
    console.log(result.fromserver, result.type);
    if (result.fromserver) {
        switch (result.type) {
            case "imagecount":
                appendButtons(result.data);

                break;
            case "upscaledfile":
                updateLoading(false);
                break;
        }

    }


})
