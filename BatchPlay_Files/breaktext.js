async function moveLayer(top, left) {
    await ps_Bp([{
        "_obj": "move",
        "_target": [{
            "_ref": "layer",
            "_enum": "ordinal",
            "_value": "targetEnum"
        }],
        "to": {
            "_obj": "offset",
            "horizontal": {
                "_unit": "pixelsUnit",
                "_value": left
            },
            "vertical": {
                "_unit": "pixelsUnit",
                "_value": top
            }
        }
    }], {});
}


const layer = app.activeDocument.activeLayers[0];

bpSync([{
    "_obj": "get",
    "_target": [{
        "_ref": "layer",
        "_id": layer._id,
    }]
}], "some tag").then(async (text) => {


    const texts = (text[0].textKey.textKey).split("\r");
    console.log(texts);
    if (texts.length > 1) {
        let top = 0;
        for (const text of texts) {
            await ps_CoreModal(async () => {
                const newtxt = await layer.duplicate();
                newtxt.name = layer.name;
                await ps_Bp([{
                    "_obj": "set",
                    "_target": [{
                        "_ref": "textLayer",
                        "_id": newtxt._id
                    }],
                    "to": {
                        "_obj": "textLayer",
                        "textKey": text,
                    }
                }], {});
                await moveLayer(top, 0);
                top += newtxt.boundsNoEffects.bottom - newtxt.boundsNoEffects.top;

            }, { commandName: "hello" });



        }
        await ps_CoreModal(async () => { await layer.delete(); }, { commandName: "tag" })


    }
})







