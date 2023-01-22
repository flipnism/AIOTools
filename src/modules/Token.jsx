import { logme } from './bp';

const fs = require('uxp').storage.localFileSystem;

export const TOKEN = Object.freeze({
    ROOT: "root folder",
    TEMPLATE: "template",
    BAHAN: "smartobject",
    DEFAULT_TEMPLATE: "default template",
    NAUFAL: "folder naufal",
    REFLY: "folder refly",
    OGIE: "folder ogie",
    BP: "batchplay",
    GGP: "gigapixel",
    TEXTURE: "texture",
    DOWNLOAD: "download"
});


export class Token {
    constructor() {
        this.root_token = null;
    }
    async getToken(key) {
        const saved_token = localStorage.getItem(TOKEN.ROOT);
        return new Promise(async (resolve, reject) => {
            if (saved_token) {
                const new_token = await fs.getEntryForPersistentToken(saved_token);
                const thisfolder = await new_token.getEntry(`${key}`);
                if (thisfolder.isFolder)
                    resolve(thisfolder)
                else
                    reject()
            } else {
                reject();
            }
        })




        //    const pte = localStorage.getItem(key);           
        //     return new Promise(async(res,rej)=>{
        //         if(pte){
        //             fs.getEntryForPersistentToken(pte).then((result)=>{
        //                 res(result);
        //             }).catch((error)=>rej(error))
        //         }else{
        //             rej("null")
        //         }

        //     });

    }
    async rootToken() {
        await fs.getFolder().then(async (result) => {
            this.root_token = await fs.createPersistentToken(result);
            localStorage.setItem(TOKEN.ROOT, this.root_token);
        })

    }
    async getFolder(key) {
        if (!this.root_token)
            await this.rootToken();
        location.reload();
        const entry = await fs.getEntryForPersistentToken(this.root_token);
        const folder = await entry.getEntry(key);

        return folder;


        // await fs.getFolder().then(async(result)=>{
        //     localStorage.setItem(key, await fs.createPersistentToken(result));
        // })

    }

}