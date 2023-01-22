class Token {
    static TEMPLATE = "key_template";
    static BAHAN = "key_smartobject";
    static DEF_TEMPLATE = "key_default_template";
    static S_NAUFAL = "key_naufal";
    static S_REFLY = "key_refly";
    static S_OGIE = "key_ogie";
    static S_INANG = "key_inang";
    static S_ZOOM = "key_zoom";
    static COLOR = "key_color";
    static BP = "key_bp";
    static TEXTURE = "key_texture";
    static IMGSEARCH = "Key_Images_Search";
    static GGP = "Gigapixel_Folder";

    constructor() {
    }
    getToken(key) {
        return new Promise(async(resolve,reject)=>{
            let pte, entryobject;
            try {
                pte = localStorage.getItem(key);
                entryobject = await fs.getEntryForPersistentToken(pte);
            } catch (error) {
                reject(null);
                await this.showYesNoDialog("Picking folder", `for ${key}`, async (result) => {
                    if (result) {
                        try {
                            entryobject = await fs.getFolder();
                            localStorage.setItem(key, await fs.createPersistentToken(entryobject));
                        } catch (error) {
                        }
                    }
                })
            }
            resolve(entryobject);
        })
        
    }
    async showYesNoDialog(title, content, action) {


        try {
            const theDialog = document.createElement("dialog");
            const theForm = document.createElement("form");
            const theHeading = document.createElement("sp-heading");
            const theDivider = document.createElement("sp-divider");
            const theBody = document.createElement("sp-body");
            const theFooter = document.createElement("footer");
            const theActionButton = document.createElement("sp-button");
            const theCancelButton = document.createElement("sp-button");

            theHeading.textContent = title;
            theDivider.setAttribute("size", "large");
            theBody.textContent = content;
            theActionButton.textContent = "Ok";
            theActionButton.setAttribute("variant", "cta");
            theCancelButton.textContent = "Cancel";
            theCancelButton.setAttribute("quiet", "true");
            theCancelButton.setAttribute("variant", "secondary");

            theActionButton.onclick = () => {
                theDialog.close();
                action(true);
            };
            theCancelButton.onclick = () => {
                theDialog.close();
                action(false);
            };

            theFooter.appendChild(theCancelButton);
            theFooter.appendChild(theActionButton);

            theForm.appendChild(theHeading);
            theForm.appendChild(theDivider);
            theForm.appendChild(theBody);
            theForm.appendChild(theFooter);
            theDialog.appendChild(theForm);
            document.body.appendChild(theDialog);

            const r = await theDialog.uxpShowModal({
                title: "Folder picker",
                resize: "none", // "both", "horizontal", "vertical",
                size: {
                    width: 480,
                    height: 240,
                },
            });
            theDialog.remove();
        } catch (err) {
        }
    };
}

module.exports = {
    Token
}