

const _el2 = new EL(true);
const _ROOT2 = _el2.mainparent(true, "textool");

const _main = _el2.makegroup(true);



const structure = {
    parent: {
        buttonGroup: [
            { key: "key0", func: "", callback: "" },
            { key: "key1", func: "", callback: "" },
            { key: "key2", func: "", callback: "" },
            { key: "key3", func: "", callback: "" },
            { key: "key4", func: "", callback: "" },
            { key: "key5", func: "", callback: "" },
            { key: "key6", func: "", callback: "" }
        ],
        utilsGroup: ["input", "checkbox", "checkbox"]

    }
}

const parentstyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "30%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
}
const childstyle = {
    width: "50%",
    flex: "0 1 25%",
    textAlign: "center",
    verticalAlign: "center",
    lineHeight: "25px"
}
const inputstyle = {
    width: "25px",
    margin: "3px",
    padding: "0"
}
const cbstyle = {
    fontSize: "0.6rem",
    alignItems: "baseline",
    margin: "2px",
    alignSelf: "flex-start",
    height: "100%"
}

HTMLElement.prototype.STYLE = function (_style) {
    _el2.style(this, _style);
}
_ROOT2.STYLE({ marginTop: "10px" })
_main.STYLE(parentstyle);

const arr = {
    tl: "🡼",
    tt: "🡹",
    tr: "🡽",
    ml: "🡸",
    mm: "🞒",
    mr: "🡺",
    bl: "🡿",
    bm: "🢃",
    br: "🢆"
};
for (var r in arr) {

    const _btn = _el2.add(C.div, C.class_btn, arr[r]);
    _btn.STYLE(childstyle)
    _btn.setAttribute("data-value", r);
    _btn.addEventListener("click", btnListener);
    _main.appendChild(_btn);
}



console.log(localStorage.getItem("object-gap"))
const textGap = new HoldButton();
textGap.set(isNaN(localStorage.getItem("object-gap")) ? 0 : parseInt(localStorage.getItem("object-gap")));
textGap.btn.addEventListener("onUp", (e) => {

    localStorage.setItem("object-gap", textGap.get());

})
// textGap.addEventListener("input", (e) => {
//     let value = parseInt(e.target.value);
//     if (value < 0) value = 0;
//     if (value > 100) value = 100;
//     localStorage.setItem("object-gap", value);

// })
// textGap.STYLE(inputstyle);





// const cbTag = _el2.add(C.cb, "cb-check", "Tag");
// const cbMid = _el2.add(C.cb, "cb-check", "Vert");
// cbTag.STYLE(cbstyle);
// cbMid.STYLE(cbstyle);
const cbTag = new JulBox("Tag")
const cbMid = new JulBox("Vert");
const btnScale = _el2.add(C.div, C.class_btn, "SCALE");
const btnTagScale = _el2.add(C.div, C.class_btn, "TAGSCALE");


//text align canvas
const align_btn = ["LEFT", "MID", "RIGHT"];
const group_align = _el2.makegroup(true);


const alignstyle = {
    width: "auto",
    flex: "1",
    textAlign: "center",
    verticalAlign: "center",
}

align_btn.forEach((a_btn) => {
    const btn = _el2.add(C.div, C.class_btn, a_btn)
    btn.STYLE(alignstyle);
    btn.addEventListener("click", btnListener);
    group_align.appendChild(btn)

})
btnScale.STYLE(alignstyle);
btnTagScale.STYLE(alignstyle);



btnScale.addEventListener("click", btnListener);
btnTagScale.addEventListener("click", btnListener);


const _2 = _el2.makegroup(false);
_2.STYLE({ height: "50px" })
const _texgroup = _el2.makegroup(true);
_texgroup.STYLE({ alignItems: "flex-start", alignContent: "flex-start" })

group_align.appendChild(btnScale);
group_align.appendChild(btnTagScale);
group_align.STYLE({ flex: "1" })
_texgroup.appendChild(textGap.btn);
_texgroup.appendChild(cbTag.root);
_texgroup.appendChild(cbMid.root);

_2.appendChild(group_align);
_2.appendChild(_texgroup);


_ROOT2.appendChild(_main);
_ROOT2.appendChild(_2);



_el2.attachGroup(_ROOT2);

const geser = async (x, y) => {
    await ps_CoreModal(async () => {
        await ps_Bp([{
            "_obj": "move",
            "_target": [
                {
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "offset",
                "horizontal": {
                    "_unit": "pixelsUnit",
                    "_value": x
                },
                "vertical": {
                    "_unit": "pixelsUnit",
                    "_value": y
                }
            },
            "_isCommand": true
        }], {});
    }, { commandName: "some tag" });

}
const ALIGN = {
    LEFT: "ADSLefts",
    RIGHT: "ADSRights",
    CENTERHORIZONTAL: "ADSCentersH",
    TOP: "ADSTops",
    BOTTOM: "ADSBottoms",
    CENTERVERTICAL: "ADSCentersV"

}
async function alignLayers(alignto, toCanvas) {
    console.log("align layer");
    await ps_CoreModal(async () => {
        await ps_Bp([{
            "_obj": "align",
            "_target": [
                {
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "using": {
                "_enum": "alignDistributeSelector",
                "_value": alignto
            },
            "alignToCanvas": toCanvas
        }], {})
    })
}
const docWidth = 1280;
const docHeight = 720;
async function btnListener(e) {
    var val;
    try {
        val = e.target.textContent;
    } catch (error) {
        val = e;

    }

if(!val.includes("SCALE")){
    await SelectTexts();
}
    

    console.log("yea is done");

    const _all = app.activeDocument.activeLayers;

    const ver = _all.sort(function (a, b) { return a.boundsNoEffects.top - b.boundsNoEffects.top });
    const verbot = _all.sort(function (a, b) { return b.boundsNoEffects.bottom - a.boundsNoEffects.bottom });
    const _left = _all.sort(function (a, b) { return a.boundsNoEffects.left - b.boundsNoEffects.left });
    const _right = _all.sort(function (a, b) { return b.boundsNoEffects.right - a.boundsNoEffects.right });

    const top = ver[0].boundsNoEffects.top;
    const bottom = verbot[0].boundsNoEffects.bottom;
    const left = _left[0].boundsNoEffects.left;
    const right = _right[0].boundsNoEffects.right;

    const width = right - left;
    const height = bottom - top;


    const margin = parseInt(textGap.get());
    const leftGut = cbTag.state ? 104 : 0;






    const x = ((docWidth / 2)) - (((width / 2) + left));
    let y = 0;
    if (cbMid.state) {
        y = (docHeight / 2) - ((height / 2) + top)
    }

    switch (val) {

        case arr.tl:

            await geser(-(left) + (leftGut + margin), margin + (-top))
            break;
        case arr.tr:

            await geser((docWidth - right) - margin, margin + (-top));
            break;
        case arr.bl:
            await geser(-(left) + (leftGut + margin), (docHeight - bottom) - margin)
            logUi(docHeight, bottom, margin)


            break;
        case arr.br:
            await geser((docWidth - right) - margin, (docHeight - bottom) - margin);

            break;
        case arr.ml:
            await geser(-(left) + (leftGut + margin), 0)

            break;
        case arr.mr:
            await geser((docWidth - right) - margin, 0);

            break;
        case arr.tt:
            await geser(0, -(top) + margin)
            break;

        case arr.bm:

            await geser(0, (docHeight - bottom) - margin)

            break;
        case arr.mm:

            await geser(x + (leftGut / 2), y);

            break;

        case "SCALE":
            await ps_CoreModal(async () => {
                const scale = ((docWidth - leftGut - (margin * 2)) / width) * 100
                await app.activeDocument.activeLayers[0].scale(scale, scale);
            }, { commandName: "some tag" }).catch(e => logUi(e))
            break;
        case "TAGSCALE":
            await ps_CoreModal(async () => {
                const curlayer = app.activeDocument.activeLayers[0];
                const curhi = curlayer.boundsNoEffects.height;
                const scale = (100 / curhi) * 100;
                await curlayer.scale(scale, scale);
            }, { commandName: "some tag" });
            break;
        case "LEFT":
            await alignLayers(ALIGN.LEFT, false);
            break;
        case "MID":
            await alignLayers(ALIGN.CENTERHORIZONTAL, false);
            break;
        case "RIGHT":
            await alignLayers(ALIGN.RIGHT, false);
            break;
    }


}


document.addEventListener("SOCKETMESSAGE", async (ev) => {

    const result = ev.detail;


    if (result.fromserver) {
        switch (result.type) {
            case "imagecount":
                appendButtons(result.data);

                break;
            case "upscaledfile":
                updateLoading(false);
                break;
            case "depthmask":
                const response = result;
                const resultmi = await roottoken.getToken("midasresult");
                const entry = await resultmi.getEntry(`${response.data}.png`);
          
                const _entry = await ps_Fs.createSessionToken(entry);
                await _delay(100);
               
                let maskid;
                await ps_CoreModal(async () => {
                    const resultp = await ps_Bp([{
                        "_obj": "placeEvent",
                        "null": {
                            _path: _entry,
                            _kind: "local",
                        },
                        "linked": true
                    }, {
                        "_obj": "rasterizeLayer",
                        "_target": [
                            {
                                "_ref": "layer",
                                "_enum": "ordinal",
                                "_value": "targetEnum"
                            }
                        ]
                    }], {})
                    maskid = resultp[0].ID;
                }, { commandName: "hello" });
                await require("photoshop").core.performMenuCommand({ commandID: 1801 })

                openYesNoDialog("Depth Map",
                    `Are u sure?
            make sure to make the darkside darker
            and the light side lighter...
            dork!!!!`,
                    { yes: "Yes Lets Go", no: "Nope" }, async (res) => {
                        if (res) {
                            try {
                                await ps_CoreModal(async () => {
                                    await ps_Bp([{
                                        "_obj": "set",
                                        "_target": [
                                            {
                                                "_ref": "channel",
                                                "_property": "selection"
                                            }
                                        ],
                                        "to": {
                                            "_obj": "rectangle",
                                            "top": {
                                                "_unit": "pixelsUnit",
                                                "_value": 0
                                            },
                                            "left": {
                                                "_unit": "pixelsUnit",
                                                "_value": 0
                                            },
                                            "bottom": {
                                                "_unit": "pixelsUnit",
                                                "_value": 720
                                            },
                                            "right": {
                                                "_unit": "pixelsUnit",
                                                "_value": 1280
                                            }
                                        }
                                    }, {
                                        "_obj": "copyEvent",
                                        "copyHint": "pixels"
                                    }, {
                                        "_obj": "make",
                                        "new": {
                                            "_obj": "channel",
                                            "colorIndicates": {
                                                "_enum": "maskIndicator",
                                                "_value": "maskedAreas"
                                            }
                                        }
                                    }, {
                                        "_obj": "paste",
                                        "antiAlias": {
                                            "_enum": "antiAliasType",
                                            "_value": "antiAliasNone"
                                        },
                                        "as": {
                                            "_class": "pixel"
                                        }
                                    }, {
                                        "_obj": "select",
                                        "_target": [
                                            {
                                                "_ref": "channel",
                                                "_enum": "channel",
                                                "_value": "RGB"
                                            }
                                        ]
                                    }, {
                                        "_obj": "delete",
                                        "_target": [
                                            {
                                                "_ref": "layer",
                                                "_id": parseInt(maskid)
                                            }
                                        ]
                                    }], {})
                                }, { commandName: "hello" });
                                await require("photoshop").core.performMenuCommand({ commandID: 1017 })
                                await require("photoshop").core.performMenuCommand({ commandID: 2970 })
                 
                                await require("photoshop").core.performMenuCommand({ commandID: -402 })


                            } catch (error) {
                                console.error(error);
                            }

                        }
                    });
                updateLoading(false);
            
            
                break;
            case "hotkey":
                // tl: "🡼",
                // tt: "🡹",
                // tr: "🡽",
                // ml: "🡸",
                // mm: "🞒",
                // mr: "🡺",
                // bl: "🡿",
                // bm: "🢃",
                // br: "🢆"
                console.log(result.data);
                switch (result.data) {

                    case "topleft": btnListener(arr.tl); break;
                    case "toptop": btnListener(arr.tt); break;
                    case "topright": btnListener(arr.tr); break;
                    case "midleft": btnListener(arr.ml); break;
                    case "midmid": btnListener(arr.mm); break;
                    case "midright": btnListener(arr.mr); break;
                    case "botleft": btnListener(arr.bl); break;
                    case "botbot": btnListener(arr.bm); break;
                    case "botright": btnListener(arr.br); break;
                    case "LEFT": await alignLayers(ALIGN.LEFT, false); break;
                    case "MID": await alignLayers(ALIGN.CENTERHORIZONTAL, false); break;
                    case "RIGHT": await alignLayers(ALIGN.RIGHT, false); break;

                    case "adj_curves": applyAdjustmentLayer(ADJLAYER.CURVES); break;
                    case "adj_huesaturation": applyAdjustmentLayer(ADJLAYER.HUESATURATION); break;
                    case "adj_exposure": applyAdjustmentLayer(ADJLAYER.EXPOSURE); break;
                    case "adj_colorbalance": applyAdjustmentLayer(ADJLAYER.COLORBALANCE); break;
                    case "adj_gradientmap": applyAdjustmentLayer(ADJLAYER.GRADIENTMAP); break;
                    case "adj_lut": applyAdjustmentLayer(ADJLAYER.LUT); break;
                    case "deleteandfill":
                        await require("photoshop").core.performMenuCommand({ commandID: 5280 })                   
                    break;


                }

                break;
        }

    }


})

