
const nodefs = require('fs');
const CONF_FILE = "plugin-data:/RAW_FILT_CONFIG.json";
function readConfig() {
    try {
        const text = nodefs.readFileSync(CONF_FILE, { encoding: "utf-8" });
        return JSON.parse(text);
    } catch (err) {
        return [];
    }

}

let sliders = [
    { id: 0, name: 'texture', min: 0, max: 100, value: 0, step: 1 },
    { id: 1, name: 'clarity', min: 0, max: 100, value: 0, step: 1 },
    { id: 2, name: 'sharpen', min: 0, max: 150, value: 0, step: 1 },
    { id: 3, name: 'noise reduction', min: 0, max: 100, value: 0, step: 1 },
    { id: 4, name: 'colornoise reduction', min: 0, max: 100, value: 0, step: 1 },
    { id: 5, name: 'vignette', min: -100, max: 100, value: 0, step: 1 },
    { id: 6, name: 'grain', min: 0, max: 100, value: 0, step: 1 },
    { id: 7, name: 'stylization', min: 0, max: 10, value: 0, step: 0.1 },
    { id: 8, name: 'cleanliness', min: 0, max: 10, value: 0, step: 0.1 },
    { id: 9, name: 'brush scale', min: 0, max: 10, value: 0, step: 0.1 },
    { id: 10, name: 'microbrush', min: 0, max: 10, value: 0, step: 0.1 },
];
const RF_Panel = new EL(false);
const RF_ROOT = RF_Panel.mainparent(false, "rf-root");
const RF_SLIDER = RF_Panel.makegroup(true);
const CONF_GROUP = RF_Panel.makegroup(true);
const CONF_GROUP2 = RF_Panel.makegroup(true);

const CONF_EDIT = [
    "DROPDOWN",
    "APPLY",
    "SAVE",
    "COMMIT",
    "TXT",
    "SAVEPROFILE",
    "DELETEPROFILE",];

let CONF_TEXTFIELD = null;
let CONF_PICKER = null;
let CONF_LISTS = [];
CONF_EDIT.forEach((ed, idx) => {
    let div;
    if (ed == "DROPDOWN") {
        div = RF_Panel.add(C.picker, "flexme", ed);
        CONF_PICKER = div;
    }
    else if (ed == "TXT") {
        div = RF_Panel.add(C.tf, "flexme", ed);
        CONF_TEXTFIELD = div;
    }
    else
        div = RF_Panel.add(C.btn, C.class_btn, ed);
    div.addEventListener("click", onButtonClick);
    if (idx < 4)
        CONF_GROUP.appendChild(div);
    else
        CONF_GROUP2.appendChild(div);
    RF_Panel.style(CONF_GROUP2, { display: "none" });

})

function onConfigSaved() {
    RF_Panel.clearShit(CONF_PICKER.firstChild);
    RF_Panel.style(CONF_GROUP2, { display: "none" });
    CONF_LISTS = readConfig();
    CONF_LISTS.forEach(config => {
        RF_Panel.appendMenuItem(CONF_PICKER, config.name);
    })
    CONF_PICKER.selectedIndex = CONF_LISTS.length > 0 ? 0 : -1;

}
onConfigSaved();
sliders.forEach((slider) => {
    const _slider = RF_Panel.add(C.slider, `slider_${slider.id}`, slider.name);
    _slider.addEventListener("change", sliderChange);
    RF_Panel.style(_slider, { width: "50%", flexGrow: "1", padding: "0 10px" })
    RF_Panel.minmaxval(_slider, slider);
    RF_SLIDER.appendChild(_slider);
})

RF_ROOT.appendChild(CONF_GROUP);
RF_ROOT.appendChild(CONF_GROUP2);
RF_ROOT.appendChild(RF_SLIDER);
RF_Panel.attachGroup(RF_ROOT);


async function onReceiveListner(rr) {
    try {
        isApplied(rr.layerID[0]).then((result) => {
            sliders.forEach((sl) => {

                document.querySelector(`.slider_${sl.id}`).setAttribute("value", 0);
            });
            if (!result[0]) return;

            const rawfilt = result[1].filter(e => e.filter._obj == "Adobe Camera Raw Filter");
            if (rawfilt.length <= 0) return;
            const _filter = result[1].map(a => { return a.filter });

            for (const fltr of _filter) {
                if (fltr._obj === "Adobe Camera Raw Filter") {
                    sliders[0].value = fltr.$CrTx;
                    sliders[1].value = fltr.$Cl12;
                    sliders[2].value = fltr.sharpen;
                    sliders[3].value = fltr.$LNR;
                    sliders[4].value = fltr.$CNR;
                    sliders[5].value = fltr.$PCVA;
                    sliders[6].value = fltr.$GRNA;
                } else if (fltr._obj === "oilPaint") {
                    sliders[7].value = fltr.stylization;
                    sliders[8].value = fltr.cleanliness;
                    sliders[9].value = fltr.brushScale;
                    sliders[10].value = fltr.microBrush;
                }
            }

            sliders.forEach((sl) => {
                console.log(sl.value);
                document.querySelector(`.slider_${sl.id}`).setAttribute("value", sl.value);
            });

        })
    } catch (error) {
        console.log(error);
    }
}
window._Emitter.off('jul:layerselect')
window._Emitter.on('jul:layerselect', onReceiveListner)


async function onButtonClick(e) {
    switch (e.target.textContent) {
        case "SAVE":
            RF_Panel.style(CONF_GROUP2, { display: "flex", marginBottom: "10px" });
            break;
        case "APPLY":
            sliders = CONF_LISTS[CONF_PICKER.selectedIndex].data;
            log(CONF_LISTS);

            sliders.forEach((sl) => {
                log(sl.value);
                document.querySelector(`.slider_${sl.id}`).setAttribute("value", sl.value);
            });
            doRawFilterandShit();
            break;
        case "COMMIT":
            await ps_CoreModal(async () => {
                await ps_Bp([{
                    "_obj": "newPlacedLayer"
                }], {});
            }, { commandName: "Apply Smart Object" });

            sliders.forEach((sl) => {

                document.querySelector(`.slider_${sl.id}`).setAttribute("value", 0);
            });

            break;
        case "SAVEPROFILE":
            let config = readConfig();
            config.push({ name: CONF_TEXTFIELD.value.toUpperCase(), data: sliders });
            nodefs.writeFileSync(CONF_FILE, JSON.stringify(config));
            CONF_TEXTFIELD.setAttribute("value", "");
            onConfigSaved();
            break;
        case "DELETEPROFILE":
            const _TEMP = CONF_LISTS.filter(item => item.name !== CONF_LISTS[CONF_PICKER.selectedIndex].name);


            nodefs.writeFileSync(CONF_FILE, JSON.stringify(_TEMP));
            onConfigSaved();
            break;
    }
}
//app.activeDocument.activeLayers[0].id

function sliderChange(e) {

    const sl_index = sliders.findIndex(ex => ex.name == e.target.dataset.name);
    sliders[sl_index].value = e.target.value;
    doRawFilterandShit();
}

const rawfiltercommand = () => {
    return {
        "_obj": "Adobe Camera Raw Filter",
        "$CrVe": "15.1.1",
        "$PrVN": 5,
        "$PrVe": 184549376,
        "$CrTx": sliders[0].value,//texture
        "$Cl12": sliders[1].value,//clarity
        "sharpen": sliders[2].value,//sharpen
        "$ShpR": 1,
        "$ShpD": 25,
        "$ShpM": 0,
        "$LNR": sliders[3].value,//noisered
        "$LNRD": 50,
        "$LNRC": 0,
        "$CNR": sliders[4].value,//colornoise
        "$CNRD": 50,
        "$CNRS": 50,
        "$GRNA": sliders[6].value,//colornoise
        "$GRNS": 25,
        "$GRNF": 50,
        "$PCVA": sliders[5].value,//colornoise
        "$PCVM": 50,
        "$PCVF": 50,
        "RGBSetupClass": 0
    }
}

const oilPaintCommand = () => {
    return {
        "_obj": "oilPaint",
        "lightingOn": false,
        "stylization": sliders[7].value,//style
        "cleanliness": sliders[8].value,//clean
        "brushScale": sliders[9].value,//brush
        "microBrush": sliders[10].value,//microbrush
    }
}
async function doRawFilterandShit() {
    let command = []
    try {
        const applied = await isApplied(app.activeDocument.activeLayers[0].id);

        if (applied[0] == true) {
            //"oilPaint" "Adobe Camera Raw Filter"
            const rawfilt = applied[1].filter(e => e.filter._obj == "Adobe Camera Raw Filter");
            let raw_idx, oil_idx;
            if (rawfilt.length > 0) {
                for (const [i, v] of applied[1].entries()) {
                    console.log(v.filter._obj);
                    if (v.filter._obj === "Adobe Camera Raw Filter") {
                        raw_idx = i + 1;
                    } else if (v.filter._obj === "oilPaint") {
                        oil_idx = i + 1;
                    }
                }
                command.push(setFilter(raw_idx, rawfiltercommand()));
                command.push(setFilter(oil_idx, oilPaintCommand()));
            } else {
                command.push(rawfiltercommand());
                command.push(oilPaintCommand());
            }

        } else {
            command.push(rawfiltercommand());
            command.push(oilPaintCommand());
        }
    } catch (error) {

    }
    await ps_CoreModal(async () => {

        await ps_Bp(command, {}).catch((e) => { console.log(e) });

    }, { commandName: "raw filter and shit" });
}



