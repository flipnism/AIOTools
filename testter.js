const path = require('path');
const fs = require('fs');
const directoryPath = "I:\\_GOOGLE DRIVE\\GOOGLE DRIVE RK\\THUMBNAIL\\BAHAN";
const pattern = /.+?(\d.+?)\.psb/g
const file = fs.readdirSync(directoryPath)
const f = file.filter((ff) => ff.includes("susno"));
const num = f.map((x) => {
    const ma = pattern.exec(x);
    if (ma) {
        return (ma[1])
    }
}).filter((xx) => xx != undefined);
logme(num);



function batchplay(){
    const cmd = {
        "_obj": "show",
        "null": [
           {
              "_ref": "layer",
              "_name": "repot"
           }
        ],
        "_isCommand": true
     }
    await require("photoshop").core.executeAsModal(async()=>{
        await require("photoshop").action.batchPlay([cmd],{})
    },{commandName:"test"})
   

}