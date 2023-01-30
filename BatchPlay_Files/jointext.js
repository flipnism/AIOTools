const layers = app.activeDocument.activeLayers;
if (layers.length < 2)
    return;

openYesNoDialog("Join this Texts",
    `Join multiple texts...
    Left to Right       [join text from the closest left to the edge to the fartest]
    Top to Bottom       [join text from the top to bottom order]
    `,
    { yes: "Left to Right", no: "Top to Bottom" },
    async (r2l) => {
        await ps_CoreModal(async (executionContext, descriptor) => {
            let suspensionID = await executionContext.hostControl.suspendHistory({
                documentID: app.activeDocument.id,
                name: "Join this Texts",
            });
            const alltexts = r2l ? layers.sort(function (a, b) { return a.boundsNoEffects.left - b.boundsNoEffects.left }) : layers.sort(function (a, b) { return a.boundsNoEffects.top - b.boundsNoEffects.top });;
            let newtext = []
            for (const text of alltexts) {
                await bpSync([{
                    "_obj": "get",
                    "_target": [{
                        "_ref": "layer",
                        "_id": text._id,
                    }]
                }], "some tag").then((text) => {

                    newtext.push(text[0].textKey.textKey);
                })
            }

            await ps_Bp([{
                "_obj": "set",
                "_target": [{
                    "_ref": "textLayer",
                    "_id": alltexts[0]._id
                }],
                "to": {
                    "_obj": "textLayer",
                    "textKey": newtext.join(" "),
                }
            }], {});

            for (const txt of alltexts) {
                if (txt != alltexts[0]) {
                    await txt.delete();
                }
            }

            await executionContext.hostControl.resumeHistory(suspensionID);
        }, { commandName: "tag" })



    })