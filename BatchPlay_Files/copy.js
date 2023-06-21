(async () => {

    await ps_CoreModal(async () => {
        const target = [
            {
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }
        ]
        const result = await ps_Bp([{
            "_obj": "duplicate",
            "_target": target
        }, {
            "_obj": "mergeLayersNew"
        }, {
            _obj: "get",
            _target: target
        }], {});
        const __id = result[result.length - 1].layerID;
       
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
        }, {
            "_obj": "set",
            "_target": target,
            "to": {
                "_obj": "layer",
                "name": "COPIED"
            }
        }, {
            "_obj": "delete",
            "_target": [
                {
                    _ref: 'layer',
                    _id: __id
                }
            ],
        }], {});
    }, { commandName: "some tag" });
})()
