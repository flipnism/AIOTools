async function doThis(){
    let pte,userFolder;
    try {
        pte =localStorage.getItem("temp-save");
        userFolder =  await fs.getEntryForPersistentToken(pte);
    } catch (error) {
        console.log(error);
        userFolder = await fs.getFolder();
        localStorage.setItem("temp-save",await fs.createPersistentToken(userFolder))
    }
    
    try {
        await BP([{
            "_obj": "show",
            "null": [
               {
                  "_ref": "layer",
                  "_enum": "ordinal",
                  "_value": "targetEnum"
               }
            ],
            "toggleOptionsPalette": true
         }],{});
         let r = (Math.random() + 1).toString(36).substring(7);
         const newJPG = await userFolder.createFile(r+ ".jpeg", { overwrite: true });
         const saveJPEG = await fs.createSessionToken(newJPG);
         await require("photoshop").core.executeAsModal(async()=>{
            const result = await BP([{
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
            },{
                "_obj": "show",
                "null": [
                   {
                      "_ref": "layer",
                      "_enum": "ordinal",
                      "_value": "targetEnum"
                   }
                ],
                "toggleOptionsPalette": true
             }],{});

            
            const websocket = new WebSocket("ws://localhost:7898/Server", "ps-protocol")
            websocket.onopen = (evt)=>{
                websocket.send(JSON.stringify({
                    type: "layerpath",
                    fromserver: false,
                    data: result[0].in._path
                }));
            }
            
        });

    } catch (error) {
        console.log(error);
    }

    
}
doThis();
