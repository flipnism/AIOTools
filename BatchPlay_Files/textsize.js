
const GETKEY = () => {
    return isNaN(localStorage.getItem("font-size")) ? 0 : parseInt(localStorage.getItem("font-size"));
}
function SETKEY() {

}
function makeSizePanel() {
    const sizePanel = new EL();
    const ROOT = sizePanel.mainparent(true, "hello")

    const txtfield = new HoldButton();// sizePanel.add(C.tf, "flexme", "40","number");
    txtfield.set(GETKEY());
    txtfield.btn.addEventListener("onUp", (e) => {

        localStorage.setItem("font-size", txtfield.get());

    })
    const btn = sizePanel.add(C.btn, C.class_btn, "Apply");
    ROOT.appendChild(txtfield.btn);
    ROOT.appendChild(btn);
    sizePanel.attachGroup(ROOT);
    btn.addEventListener("click", async (e) => {
        await ps_CoreModal(async () => {
            await ps_Bp([{
                "_obj": "set",
                "_target": [
                    {
                        "_ref": "property",
                        "_property": "textStyle"
                    },
                    {
                        "_ref": "textLayer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }
                ],
                "to": {
                    "_obj": "textStyle",
                    "textOverrideFeatureName": 808465458,
                    "typeStyleOperationType": 3,
                    "size": {
                        "_unit": "pointsUnit",
                        "_value": parseInt(txtfield.get())
                    }
                },
                "_isCommand": true
            }], {});
        }, { commandName: "some tag" });
    })

}

try {
    makeSizePanel();
} catch (error) {
    log(error);
}
