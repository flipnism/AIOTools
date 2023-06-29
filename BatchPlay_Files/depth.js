// sockSendMessage({
//     type: "depthmask",
//     fromserver: false,
//     data: "null"
// })

(async () => {


    init();

})()


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

