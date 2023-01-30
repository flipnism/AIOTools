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
        "_obj": "paste",
        "antiAlias": {
            "_enum": "antiAliasType",
            "_value": "antiAliasNone"
        },
        "as": {
            "_class": "pixel"
        }
    }], {});
}, { commandName: "some tag" });