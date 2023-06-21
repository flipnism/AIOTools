const expSlider = {
    Bokeh: { id: 0, min: 0, max: 100, value: 30, default: 30, step: 1 },
    Distance: { id: 1, min: 0, max: 1, value: 0.34, default: 0.34, step: 0.01 },
    OutDistance: { id: 2, min: 0, max: 1, value: 0.71, default: 0.71, step: 0.01 },
    positionX: { id: 3, min: -0.42, max: 0.42, value: 0, default: 0, step: 0.01 },
    positionY: { id: 4, min: -0.26, max: 0.26, value: 0, default: 0, step: 0.01 },
    Clarity: { id: 5, min: -100, max: 100, value: 100, default: 100, step: 1 },
    VigAmount: { id: 6, min: -100, max: 100, value: 95, default: 95, step: 1 },
    VigSize: { id: 7, min: -100, max: 100, value: -33, default: -33, step: 1 }
}
function range(value) {
    //i-1 0.251803 0.373403 
    //i-2 0.986281 0.339441
    const a1 = 0.251803
    const a2 = 0.373403
    const b1 = 0.986281
    const b2 = 0.339441
    const min = ((value - 0) * (a2 - a1)) / (1 - 0) + a1
    const max = ((value - 1) * (b1 - b2)) / (0 - 1) + b2
    return [min, max]
};
function ranges(value, a1, a2) {
    const min = ((value - 0) * (a2 - a1)) / (1 - 0) + a1
    return min
};
function _EXPOSURE(exp) {
    //const [min, max] = range(exp.bokehDistance.value);
    const min = ranges(exp.Distance.value, 0.01, 0.5)
    const max = ranges(exp.OutDistance.value, 0.01, 0.95)
    const result = {
        "_obj": "Exposure X7 Alien_Skin",
        "$NLnl": 1,
        "$SsPS": `[
            {
                "header": {
                    "asxml_version": "20210901",
                "filter": "",
                "set": "Exposure X7"
        }
    },
        {
                "baseLayer": {
                    "CFnr": true,
                "CFnr ": "--- Enable Noise Reduction ---",
                "CUla": 0,
                "LCel": false,
                "LCel ": "--- Enable Lens Correction ---"
        }
    },
        {
                "layer0": [
                    [
        
                ],
                {
                        "20bl": -9.399999999999991,
                    "20bl ": "--- Blacks ---",
                    "20hi": -2.5600000000000023,
                    "20hi ": "--- Highlights ---",
                    "BKmb": ${exp.Bokeh.value},
                    "BKmb ": "--- Bokeh Amount ---",
                    "BKre": "1 0 1 ${exp.positionX.value} ${exp.positionY.value} ${min} ${min} 0 ${max}",
                    "BKre ": "--- Blur In-Preview Regions ---",
                    "BKsf": 32,
                    "BKsf ": "--- Bokeh Zoom ---",
                    "BScn": true,
                    "BScn ": "--- Enable Basic ---",
                    "CFcl": ${exp.Clarity.value},
                    "CFcl ": "--- Clarity ---",
                    "CFdc": 33,
                    "CFdc ": "--- Denoise Color ---",
                    "CFdd": 50,
                    "CFdd ": "--- Denoise Detail ---",
                    "CFdg": 0,
                    "CFdg ": "--- Sharpening Amount ---",
                    "CFdm": 25,
                    "CFdm ": "--- Denoise Smooth ---",
                    "CFds": 100,
                    "CFds ": "--- Denoise Brightness ---",
                    "CFen": false,
                    "CFen ": "--- Enable Color Filter ---",
                    "CFsa": 26.27,
                    "CFsa ": "--- Sharpen Amount ---",
                    "CFsh": false,
                    "CFsh ": "--- Enable Sharpening ---",
                    "CFsr": 2.68,
                    "CFsr ": "--- Sharpen Radius ---",
                    "CFvb": -4,
                    "CFvb ": "--- Vibrance ---",
                    "CGeg": false,
                    "CGeg ": "--- Grain Enable ---",
                    "Cdhz": -2.5600000000000023,
                    "Cdhz ": "--- Haze Level ---",
                    "DFel": false,
                    "DFel ": "--- Enable Defringe ---",
                    "DynC": -5.97999999999999,
                    "DynC ": "--- Dynamic Contrast ---",
                    "EXva": ${exp.VigAmount.value},
                    "EXva ": "--- Vignette Amount ---",
                    "EXvs": ${exp.VigSize.value},
                    "EXvs ": "--- Vignette Size ---",
                    "FOen": false,
                    "FOen ": "--- Enable Focus ---",
                    "IRen": false,
                    "IRen ": "--- Enable IR ---",
                    "LUen": false,
                    "LUen ": "--- Enable LUT ---",
                    "PRfo": "Custom_Factory: -8-Off",
                    "PRfo ": "--- Focus Preset ---",
                    "PRln": "Custom_Factory: -8-Off",
                    "PRln ": "--- Lens Preset ---",
                    "PRvi": "Custom_Factory: -8-Off",
                    "PRvi ": "--- Vignette Preset ---",
                    "SEmo": true,
                    "SEmo ": "--- Setting has been modified ---",
                    "TCen": false,
                    "TCen ": "--- Enable Tone Curve ---",
                    "TXen": false,
                    "TXen ": "--- Enable Texture ---",
                    "VGen": true,
                    "VGen ": "--- Enable Vignette ---",
                    "pLNA": true,
                    "pLNa": "Layer 1",
                    "pLUU": ""
            }
        ]
    }
]
    `,

    }

    return result;
}



const slider_style = { padding: "5px", flex: "1 1 calc(50%)", }
const exposureEL = new EL(false);
const expROOT = exposureEL.mainparent(true, "hello-exposure");
const EX_GROUP = exposureEL.makegroup(true);
const EX_GROUP2 = exposureEL.makegroup(true);


for (const sl in expSlider) {
    const name = sl;
    const bokehslider = exposureEL.add(C.slider, `sld_${expSlider[name].id}`, name);
    exposureEL.style(bokehslider, slider_style);
    exposureEL.minmaxval(bokehslider, expSlider[name])
    bokehslider.addEventListener("change", async (e) => {
        expSlider[name].value = e.target.value;

        doUrMagic()



    })
    EX_GROUP.appendChild(bokehslider);
}



const btn_so = exposureEL.add(C.div, C.class_btn, "CONVERT TO SMARTOBJECT");
const btn_apply = exposureEL.add(C.div, C.class_btn, "APPLY DEFAULT");
btn_apply.addEventListener('click', doUrMagic);
btn_so.addEventListener("click", async () => {
    await ps_CoreModal(async () => {
        await ps_Bp([{
            "_obj": "newPlacedLayer"
        }], {});
    }, { commandName: "Apply Smart Object" });
})
exposureEL.style(EX_GROUP, { width: "100%" })
exposureEL.style(EX_GROUP2, { width: "100%", marginTop: "10px", justifyContent: "space-between" })
EX_GROUP2.appendChild(btn_apply);
EX_GROUP2.appendChild(btn_so);

expROOT.appendChild(EX_GROUP);
expROOT.appendChild(EX_GROUP2);
exposureEL.attachGroup(expROOT);




function doUrMagic() {

    let cmd = _EXPOSURE(expSlider);




    isApplied(lyrID()).then(async (lEffct) => {

        await ps_CoreModal(async () => {

            if (lEffct[0] != true) {
                await ps_Bp([cmd], {});
                return;
            }
            for (const [i, v] of lEffct[1].entries()) {
                if (v.filter._obj == "Exposure X7 Alien_Skin") {


                    await ps_Bp([setFilter(i + 1, cmd)], {});
                    return;
                }

            }
            await ps_Bp([cmd], {});


        }, { commandName: "some tag" }).catch(e => log(e));

    })


}

async function onLayerSelectionChange(d) {

    for (const sl in expSlider) {
        const name = sl;
        document.querySelector(`.sld_${expSlider[name].id}`).setAttribute("value", expSlider[name].default);

    }


}

window._Emitter.off('jul:layerselect')
window._Emitter.on('jul:layerselect', onLayerSelectionChange)