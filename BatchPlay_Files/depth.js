// sockSendMessage({
//     type: "depthmask",
//     fromserver: false,
//     data: "null"
// })


try {
    localSocket().onmessage = async (ev) => {
        const response = JSON.parse(ev.data);
        if (response.fromserver && response.type == "depthmask") {
            const result = await roottoken.getToken("midasresult");
            const entry = await result.getEntry(`${response.data}.png`);
            logUi(entry)
            const _entry = await ps_Fs.createSessionToken(entry);
            await _delay(100);
            logUi(_entry)
            let maskid;
            await ps_CoreModal(async () => {
                const result = await ps_Bp([{
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
                maskid = result[0].ID;
            }, { commandName: "hello" });
            await ps_Core.performMenuCommand({ commandID: 1801 })
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

                        } catch (error) {
                            console.error(error);
                        }

                    }
                });
            updateLoading(false);
        }
    };
    await _delay(300)
    updateLoading(true);
    init();
} catch (error) {
    logUi(error);
}




async function init() {
    updateLoading(true);
    const temp = await roottoken.getToken("midastemp");

    const merge = await bpSync([{
        "_obj": "show",
        "null": [
            {
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }
        ],
        "toggleOptionsPalette": true,
    }, {
        "_obj": "mergeVisible",
        "duplicate": true
    }], "tag");

    let r = (Math.random() + 1).toString(36).substring(7);
    const newJPG = await temp.createFile(r + ".jpeg", { overwrite: true });
    const saveJPEG = await ps_Fs.createSessionToken(newJPG);
    const saved_imgs = await bpSync([{
        "_obj": "save",
        "as": {
            "_obj": "JPEG",
            "extendedQuality": 10,
            "matteColor": {
                "_enum": "matteColor",
                "_value": "none"
            }
        },
        "in": {
            "_path": saveJPEG,
            "_kind": "local"
        },
        "documentID": app.activeDocument._id,
        "copy": true,
        "lowerCase": true,
        "saveStage": {
            "_enum": "saveStageType",
            "_value": "saveBegin"
        }
    }], "some tag");
    sockSendMessage({
        type: "depthmask",
        fromserver: false,
        data: saved_imgs[0].in._path
    })

}