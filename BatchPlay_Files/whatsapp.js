const wa = new EL();
const WA_ROOT = wa.mainparent(true, "wa-panel");
wa.style(WA_ROOT, { overflowY: "auto", maxHeight: "300px" })
const GROUP1 = wa.makegroup(true);
const GROUP2 = wa.makegroup(false);
const url = "http://localhost:3000";
function isDone(id) {
    fetch(`${url}/done/${id}`)
        .then(response => { if (response.ok) return response.json() })
        .then(result => {
            log(result);
        })
}

function makeChat(r) {
    const div = makeEL("div", { background: "#111", borderRadius: "5px", width: "100%", display: "flex", flexWrap: "wrap", flexDirection: "row" });
    const text = makeEL("span", { fontSize: "0.95em", flex: "1", color: "#fff", padding: "5px 10px", whiteSpace: "pre-wrap", fontFamily: "Roboto" }, r.text);
    text.addEventListener("mousedown", (e) => { e.target.style.color = "#fd0"; })
    text.addEventListener("mouseup", (e) => { e.target.style.color = "#fff"; })
    text.addEventListener("click", (e) => {
        sockSendMessage({
            fromserver: false,
            type: "sendtextclipboard",
            data: e.target.textContent
        })
    })
    const btn = makeEL("div", { color: "#fff", width: "20px", height: "20px", textAlign: "center", lineHeight: "20px", fontWeight: "900" }, "X");
    btn.setAttribute('data-value', r._id);
    btn.addEventListener("click", (e) => {

        isDone(e.target.dataset.value);
        const parent = e.target.parentNode.remove();
        parent.remove();

    });
    div.appendChild(btn);
    div.appendChild(text);
    GROUP2.appendChild(div);


}

const btn = wa.add(C.btn, C.class_btn, "RELOAD")
wa.style(btn, { width: "100%", flex: "1" })
btn.addEventListener("click", async () => {
    fetch(`${url}/todolist`)
        .then(response => { if (response.ok) return response.json() })
        .then(result => {
            for (const r of result) {

                makeChat(r);

            }
        })
})
GROUP1.appendChild(btn);


WA_ROOT.appendChild(GROUP1)
WA_ROOT.appendChild(GROUP2)
wa.attachGroup(WA_ROOT);



fetch(`${url}/todolist`)
    .then(response => { if (response.ok) return response.json() })
    .then(result => {
        for (const r of result) {

            makeChat(r);

        }
    })


log(localStorage.getItem("COLOR"))