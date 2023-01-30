async function createBoxInang(){

    const layer = await app.activeDocument.activeLayers[0];
    console.log(layer)
    const range = 10;
    const b = layer.boundsNoEffects;
    
    result = await BP([{
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
           "color": {
              "_obj": "RGBColor",
              "red": 0,
              "grain": 0,
              "blue": 0
           }
        }
     },{
        "_obj": "make",
        "_target": [{
            "_ref": "contentLayer"
        }],
        "using": {
            "_obj": "contentLayer",
            "type": {
                "_obj": "solidColorLayer",
                "color": {
                    "_obj": "RGBColor",
                    "red": 255,
                    "grain": 255,
                    "blue": 255
                }
            },
            "shape": {
                "_obj": "rectangle",
                "unitValueQuadVersion": 1,
                "top": {
                    "_unit": "pixelsUnit",
                    "_value": b.top-range
                },
                "left": {
                    "_unit": "pixelsUnit",
                    "_value": b.left-(range+10)
                },
                "bottom": {
                    "_unit": "pixelsUnit",
                    "_value": b.bottom + range
                },
                "right": {
                    "_unit": "pixelsUnit",
                    "_value": b.right + range
                }
            }

        }
    }, {
        "_obj": "set",
        "_target": [{
            "_ref": "layer",
            "_enum": "ordinal",
            "_value": "targetEnum"
        }],
        "to": {
            "_obj": "layer",
            "name": "inangRect"
        }

    }],{});
    const newlayer = await app.activeDocument.activeLayers[0];
    newlayer.moveBelow(layer)
    await BP([{
        "_obj": "select",
        "_target": [
           {
              "_ref": "layer",
              "_id": layer._id
           }
        ],
        "selectionModifier": {
           "_enum": "selectionModifierType",
           "_value": "addToSelection"
        }
     },{
        "_obj": "linkSelectedLayers",
        "_target": [
           {
              "_ref": "layer",
              "_enum": "ordinal",
              "_value": "targetEnum"
           }
        ]
     }],{});
}

try {
    createBoxInang();
} catch (err) {
    console.log(err)
}
