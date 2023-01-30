

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

async function btnListener(e) {
    const _all = app.activeDocument.activeLayers;
    const ver = _all.sort(function (a, b) { return a.boundsNoEffects.top - b.boundsNoEffects.top });
    const _left = _all.sort(function (a, b) { return a.boundsNoEffects.left - b.boundsNoEffects.left });
    const _right = _all.sort(function (a, b) { return b.boundsNoEffects.right - a.boundsNoEffects.right });

    const top = ver[0].boundsNoEffects.top;
    const bottom = ver[ver.length - 1].boundsNoEffects.bottom;
    const left = _left[0].boundsNoEffects.left;
    const right = _right[0].boundsNoEffects.right;

    const width = right - left;
    const height = bottom - top;


    const margin = parseInt(textGap.get());
    const leftGut = cbTag.state ? 104 : 0;
    const val = e.target.textContent;
    const docWidth = 1280;
    const docHeight = 720;

    switch (val) {

        case arr.tl:

            await geser(-(left) + (leftGut + margin), margin + (-top))
            break;
        case arr.tr:

            await geser((docWidth - right) - margin, margin + (-top));
            break;
        case arr.bl:
            await geser(-(left) + (leftGut + margin), (docHeight - bottom) - margin)


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
            await geser(0, margin + (-top))

        case arr.bm:

            await geser(0, (docHeight - bottom) - margin)

            break;
        case arr.mm:
            const x = ((docWidth / 2)) - (((width / 2) + left));
            let y = 0;
            if (cbMid.state) {
                y = (docHeight / 2) - ((height / 2) + top)
            }
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


