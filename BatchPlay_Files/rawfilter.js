const nodefs = require('fs');
const presets = [
    {
        name: "Sharpen",
        value: {
            texture: 100,
            clarity: 75,
            sharpen: 110,
            noise_reduction: 78,
            color_noise_reduction: 25,
            stylization: 0,
            cleanliness: 0,
            brushscale: 0,
            microbrush: 0
        }
    }
];
const config_file = "plugin-data:/raw_filter_configs.json";
function ReadConfigFile() {

    try {

        const text = nodefs.readFileSync(config_file, { encoding: "utf-8" });
        return JSON.parse(text);

    } catch (err) {
        nodefs.writeFileSync(config_file, JSON.stringify(presets));
        return null;
    }

}
function createSlider(label, min, max, step) {
    const text_label = document.createElement("sp-label");
    const slider = document.createElement("sp-slider");
    slider.className = label.toLowerCase().replaceAll(" ", "_");
    slider.setAttribute("min", min);
    slider.setAttribute("max", max);
    slider.setAttribute("value", min);
    slider.setAttribute("step", step);
    slider.setAttribute("size", "s")

    text_label.setAttribute("slot", "label");
    text_label.textContent = `${label}`;
    slider.appendChild(text_label);
    slider.setAttribute("style", "width:50%;padding:0px 10px;flex-grow:1;");
    return slider;

}
function createProfileSavingForm(fields) {
    const maindiv = document.createElement("div");
    maindiv.setAttribute("style", "display:none;width:100%;flex:column wrap;");
    const txfield = document.createElement("sp-textfield");
    const btnsave = document.createElement("sp-action-button");
    const btndelete = document.createElement("sp-action-button");
    txfield.setAttribute("size", "s");
    txfield.setAttribute("style", "width:40%");
    btnsave.setAttribute("size", "s");
    btndelete.setAttribute("size", "s");
    btnsave.textContent = "Save Profile";
    btndelete.textContent = "Delete Profile";
    maindiv.appendChild(txfield);
    maindiv.appendChild(btnsave);
    maindiv.appendChild(btndelete);
    btnsave.addEventListener("click", () => {
        if (txfield.value == "") return;
        const arr = {}
        for (const fx of fields) {
            arr[fx.className] = fx.value;
        }

        const conf_file = ReadConfigFile();
        const stuff = { name: txfield.value.toUpperCase(), value: arr }
        conf_file.push(stuff);
        nodefs.writeFileSync(config_file, JSON.stringify(conf_file));
        doStuffonLoad();


    })
    btndelete.addEventListener("click", () => {
        const menus = document.querySelector(".preset_lists");
        if (menus.selectedIndex < 0) return;
        const preset = menus.children[menus.selectedIndex].textContent;
        console.log(preset);
        const conf_file = ReadConfigFile();
        const new_conf_file = conf_file.filter(item => item.name !== preset);
        nodefs.writeFileSync(config_file, JSON.stringify(new_conf_file));
        doStuffonLoad();
    });
    return maindiv;
}
function createDropDown(fields, saveform) {

    const maindiv = document.createElement("div");
    const dropdown = document.createElement("sp-picker");
    dropdown.setAttribute("size", "s")
    dropdown.setAttribute("style", "flex:1;");

    const menus = document.createElement("sp-menu");
    menus.className = "preset_lists";
    menus.setAttribute("slot", "options");

    dropdown.appendChild(menus);



    const applyb = document.createElement("sp-action-button");
    applyb.setAttribute("size", "s")

    const savepreset = document.createElement("sp-action-button");
    savepreset.setAttribute("size", "s")

    const reset = document.createElement("sp-action-button");
    reset.setAttribute("size", "s")

    savepreset.textContent = "Save";
    applyb.textContent = "Apply";
    reset.textContent = "Commit";


    applyb.addEventListener("click", () => {
        if (menus.selectedIndex < 0)
            return;
        const preset = menus.children[menus.selectedIndex].value;
        for (var p in preset) {
            const f = fields.find(o => o.className === p);
            f.value = preset[p];
        }
        eksekusi(fields);
    })
    savepreset.addEventListener("click", () => {
        saveform.style.display = saveform.style.display === "flex" ? "none" : "flex";
    })
    reset.addEventListener("click", () => {
        doStuffonLoad();
    })
    maindiv.setAttribute("style", "display:flex;width:100%;");


    maindiv.appendChild(dropdown);
    maindiv.appendChild(applyb);
    maindiv.appendChild(savepreset);
    maindiv.appendChild(reset);
    const configresult = ReadConfigFile();
    if (configresult) {
        for (const p of configresult) {
            const menuitem = document.createElement("sp-menu-item");
            menuitem.textContent = p.name;
            menuitem.value = p.value;
            menus.appendChild(menuitem);
        }
    }

    return maindiv;
}
async function UnDo() {
    await BP([{
        "_obj": "select",
        "_target": [
            {
                "_ref": "historyState",
                "_offset": -1
            }
        ]
    }], {});
}

function appendRFPanel(content) {


    const rawForm = document.createElement("div");
    rawForm.className = "camera_raw_filter";
    rawForm.setAttribute("style", "display:flex;flex-flow:row wrap;");

    let fields = [];
    for (const t of content) {
        const field = createSlider(t.title, t.min, t.max, t.step);
        rawForm.appendChild(field);
        fields.push(field);

    }

    const saveform = createProfileSavingForm(fields);
    document.querySelector(".batchplay-panel").appendChild(createDropDown(fields, saveform));
    document.querySelector(".batchplay-panel").appendChild(saveform);
    document.querySelector(".batchplay-panel").appendChild(rawForm);

    return fields;
};
async function runTasks(target) {


    try {
        await require("photoshop").core.executeAsModal(target, { "commandName": "dosomestuff", "interactive": true });
    } catch (err) {
        console.log(err);
    }




}

const bppanel = document.querySelector(".batchplay-panel");
async function doStuffonLoad() {
    while (bppanel.firstChild)
        bppanel.removeChild(bppanel.lastChild)
    const fields = appendRFPanel([
        { title: "Texture", min: 0, max: 100 },
        { title: "Clarity", min: 0, max: 100 },
        { title: "Sharpen", min: 0, max: 150 },
        { title: "Noise Reduction", min: 0, max: 100 },
        { title: "Color Noise Reduction", min: 0, max: 100 },
        { title: "stylization", min: 0, max: 10, step: 0.1 },
        { title: "cleanliness", min: 0, max: 10, step: 0.1 },
        { title: "brushScale", min: 0, max: 10, step: 0.1 },
        { title: "microBrush", min: 0, max: 10, step: 0.1 }

    ]);
    fields.forEach((sl) => {
        sl.addEventListener("change", () => {
            eksekusi(fields);
        });
    })
    await initiate();
}
async function initiate() {
    await runTasks(async (executionContext, descriptor) => {
        let test = await executionContext.hostControl.suspendHistory({
            "documentID": app.activeDocument.id,
            "name": "INITIATE"
        })
        await BP([{
            "_obj": "newPlacedLayer"
        }], {});
        await executionContext.hostControl.resumeHistory(test);
    })
}


const HIST_NAME = "DCSMS CAMFILTER";
function checkedHistory() {
    const his = app.activeDocument.historyStates;
    if (his[his.length - 1].name == HIST_NAME) {

        app.activeDocument.activeHistoryState = his[his.length - 2];
    }
}

async function eksekusi(sliders) {
    console.log("Eksekuting");
    r = []
    for (const slider of sliders) {
        r[slider.className] = slider.value;
    }

    await runTasks(async (executionContext, descriptor) => {
        checkedHistory();
        let cartoon_suspensionID = await executionContext.hostControl.suspendHistory({
            "documentID": app.activeDocument.id,
            "name": HIST_NAME
        })

        await BP([{
            "_obj": "Adobe Camera Raw Filter",
            "$CrVe": "15.1.1",
            "$PrVN": 5,
            "$PrVe": 184549376,
            "$CrTx": parseInt(r.texture),
            "$Cl12": parseInt(r.clarity),
            "sharpen": parseInt(r.sharpen),
            "$ShpR": 1,
            "$ShpD": 25,
            "$ShpM": 0,
            "$LNR": parseInt(parseInt(r.noise_reduction)),
            "$LNRD": 50,
            "$LNRC": 0,
            "$CNR": parseInt(parseInt(r.color_noise_reduction)),
            "$CNRD": 50,
            "$CNRS": 50,
            "$TMMs": 0,
            "$PGTM": 0,
            "RGBSetupClass": 0
        }], {});
        await BP([{
            "_obj": "oilPaint",
            "lightingOn": false,
            "stylization": parseInt(r.stylization),
            "cleanliness": parseInt(r.cleanliness),
            "brushScale": parseInt(r.brushscale),
            "microBrush": parseInt(r.microbrush),
            "lightDirection": -60,
            "specularity": 1.3,
            "_isCommand": true
        }], {});
        await executionContext.hostControl.resumeHistory(cartoon_suspensionID);
    })



}



doStuffonLoad();
