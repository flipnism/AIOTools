import { PSBP, PSCoreModal, app, logme, runModalTasks, fs } from "../modules/bp";

export function getSelectedLayers() {
    const selectedlayers = app.activeDocument.activeLayers;
    const sortlayer = selectedlayers.sort(function (a, b) { return b.boundsNoEffects.width - a.boundsNoEffects.width });
    return sortlayer[0];
}
export function getGroupBounds() {
    const selectedlayers = app.activeDocument.activeLayers;
    const heights = selectedlayers.sort(function (a, b) { return a.boundsNoEffects.top - b.boundsNoEffects.top });
    const lefts = selectedlayers.sort(function (a, b) { return a.boundsNoEffects.left - b.boundsNoEffects.left });
    const rights = selectedlayers.sort(function (a, b) { return b.boundsNoEffects.right - a.boundsNoEffects.right });
    const top = heights[0].boundsNoEffects.top;
    const bottom = heights[heights.length - 1].boundsNoEffects.bottom;

    return {
        t: top,
        b: bottom,
        l: lefts[0].boundsNoEffects.left,
        r: rights[0].boundsNoEffects.right
    }
}
export const ALIGN = {
    LEFT: "ADSLefts",
    RIGHT: "ADSRights",
    CENTERHORIZONTAL: "ADSCentersH",
    TOP: "ADSTops",
    BOTTOM: "ADSBottoms",
    CENTERVERTICAL: "ADSCentersV"

}
export async function alignLayers(alignto, toCanvas) {
    await PSCoreModal(async () => {
        await PSBP([{
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
export async function selectLayer(id) {
    await PSBP([{
        "_obj": "select",
        "_target": [
            {
                "_ref": "layer",
                "_id": id
            }
        ], "makeVisible": false,
    }], {}).catch(e => logme(e))
}
export async function multiselectLayer(alllayer) {
    for (const layer of alllayer) {
        await PSBP([{
            "_obj": "select",
            "_target": [
                {
                    "_ref": "layer",
                    "_id": layer.id
                }
            ],
            "selectionModifier": {
                "_enum": "selectionModifierType",
                "_value": "addToSelection"
            },
        }], {}).catch(e => logme(e))
    }
}

export async function fitImage(isWidth) {
    const currentactiveLayer = app.activeDocument.activeLayers[0];
    const width =
        currentactiveLayer.bounds.right - currentactiveLayer.bounds.left;
    const height =
        currentactiveLayer.bounds.bottom - currentactiveLayer.bounds.top;
    isWidth = width == app.activeDocument.width;

    const percent = isWidth ? (app.activeDocument.height / height) * 100 : (app.activeDocument.width / width) * 100;
    await PSCoreModal(async () => {


        await PSBP(
            [
                {
                    _obj: "transform",
                    _target: [
                        {
                            _ref: "layer",
                            _enum: "ordinal",
                            _value: "targetEnum",
                        },
                    ],
                    freeTransformCenterState: {
                        _enum: "quadCenterState",
                        _value: "QCSAverage",
                    },
                    width: {
                        _unit: "percentUnit",
                        _value: percent,
                    },
                    height: {
                        _unit: "percentUnit",
                        _value: percent,
                    },
                    linked: true,
                    interfaceIconFrameDimmed: {
                        _enum: "interpolationType",
                        _value: "bilinear",
                    },
                },
            ],
            {}
        ).catch(e => logme(e));
    }, { commandName: "fit image" });
    await alignLayers(ALIGN.CENTERVERTICAL, true).catch(e => logme(e));
    await alignLayers(ALIGN.CENTERHORIZONTAL, true).catch(e => logme(e));
}

export async function appendTexturesFile(entry) {
    await runModalTasks(async () => {
        await PSBP([{
            "_obj": "placeEvent",
            "null": {
                _path: await fs.createSessionToken(entry),
                _kind: "local",
            },
            "linked": true
        }], {});
        await fitImage(true).catch(e => logme(e));

    }).catch(e => logme(e))

}


export const ADJLAYER = {
    CURVES: {

        "_obj": "curves",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        }

    },
    EXPOSURE: {

        "_obj": "exposure",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        },
        "exposure": 0,
        "offset": 0,
        "gammaCorrection": 1

    },
    HUESATURATION: {

        "_obj": "hueSaturation",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        },
        "colorize": false

    },
    COLORBALANCE: {


        "_obj": "colorBalance",
        "shadowLevels": [
            0,
            0,
            0
        ],
        "midtoneLevels": [
            0,
            0,
            0
        ],
        "highlightLevels": [
            0,
            0,
            0
        ],
        "preserveLuminosity": true
    },
    GRADIENTMAP: {

        _obj: "gradientMapClass",
        gradientsInterpolationMethod: {
            _enum: "gradientInterpolationMethodType",
            _value: "perceptual"
        },
        gradient: {
            _obj: "gradientClassEvent",
            name: "Foreground to Background",
            gradientForm: {
                _enum: "gradientForm",
                _value: "customStops"
            },
            interfaceIconFrameDimmed: 4096,
            colors: [
                {
                    _obj: "colorStop",
                    color: {
                        _obj: "RGBColor",
                        red: 0,
                        grain: 0,
                        blue: 0
                    },
                    type: {
                        _enum: "colorStopType",
                        _value: "userStop"
                    },
                    location: 0,
                    midpoint: 50
                },
                {
                    _obj: "colorStop",
                    color: {
                        _obj: "RGBColor",
                        red: 255,
                        grain: 255,
                        blue: 255
                    },
                    type: {
                        _enum: "colorStopType",
                        _value: "userStop"
                    },
                    location: 4096,
                    midpoint: 50
                }
            ],
            transparency: [
                {
                    _obj: "transferSpec",
                    opacity: {
                        _unit: "percentUnit",
                        _value: 100
                    },
                    location: 0,
                    midpoint: 50
                },
                {
                    _obj: "transferSpec",
                    opacity: {
                        _unit: "percentUnit",
                        _value: 100
                    },
                    location: 4096,
                    midpoint: 50
                }
            ]
        }



    },
    LUT: {

        "_class": "colorLookup"

    }
}

export async function applyAdjustmentLayer(whichlayer) {
    await PSCoreModal(async () => {
        await PSBP(
            [{
                "_obj": "make",
                "_target": [{
                    "_ref": "adjustmentLayer"
                }],
                "using": {
                    "_obj": "adjustmentLayer",
                    "type": whichlayer
                }
            }, {
                "_obj": "groupEvent",
                "_target": [{
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }]
            }], {}).catch(e => logme("applyAdjustmentLayer", e));
    }, { commandName: "adjustment layer" })
        .catch(e => logme("applyAdjustmentLayer", e))


}