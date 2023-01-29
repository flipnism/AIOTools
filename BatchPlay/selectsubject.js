
async function SelectSubject(){
    await BP([{
        "_obj": "autoCutout",
        "sampleAllLayers": false  
    
     },{
      "_obj": "select",
      "_target": [
         {
            "_ref": "lassoTool"
         }
      ],
      "dontRecord": true,
      "forceNotify": true
   }],{});
}
async function appendSelection(){
    await BP([{
        "_obj": "duplicate",
        "_target": [
           {
              "_ref": "channel",
              "_property": "selection"
           }
        ]
     },{
        "_obj": "set",
        "_target": [
           {
              "_ref": "channel",
              "_property": "selection"
           }
        ],
        "to": {
           "_enum": "ordinal",
           "_value": "none"
        }
     },{
      "_obj": "select",
      "_target": [
         {
            "_ref": "moveTool"
         }
      ],
      "dontRecord": true,
      "forceNotify": true
   }],{});
}

async function applyMask(){
   await BP([{
      "_obj": "make",
      "new": {
         "_class": "channel"
      },
      "at": {
         "_ref": "channel",
         "_enum": "channel",
         "_value": "mask"
      },
      "using": {
         "_enum": "userMaskEnabled",
         "_value": "revealSelection"
      }
   },{
      "_obj": "select",
      "_target": [
         {
            "_ref": "moveTool"
         }
      ],
      "dontRecord": true,
      "forceNotify": true
   }],{});
}

const openDialog = async()=>{
     // await dialog.uxpShowModal({
    //     title:"Hello",
    //     description:'Are',
    //     resize:"none",
    //     size:{
    //         width:300,
    //         height:75
    //     }
    // }).then((result)=>{
    //     if(result){
    //         appendSelection();
    //     }
    // })
   
}

SelectSubject().then(()=>{
    openYesNoDialog("Apply Mask?","Are you sure u wanna apply this mask?",{yes:"Apply Channel Mask",no:"Apply Layer Mask"},async(res)=>{
      console.log("woi",res);
      await require("photoshop").core.executeAsModal(res?appendSelection:applyMask, { "commandName": "dosomestuff", "interactive": true });
   

    });

});
