const bppanel = document.querySelector(".batchplay-panel");

async function UnDo(){
   await BP([{
      "_obj": "select",
      "_target": [
         {
            "_ref": "historyState",
            "_offset": -1
         }
      ]
   }],{});
}
async function initiate(){
   await runTasks(async(executionContext,descriptor)=>{
       let test = await executionContext.hostControl.suspendHistory({
           "documentID": app.activeDocument.id,
           "name": "INITIATE"
       })
       await BP([{
           "_obj": "newPlacedLayer"
        },{
           "_obj": "rasterizeLayer",
           "_target": [
              {
                 "_ref": "layer",
                 "_enum": "ordinal",
                 "_value": "targetEnum"
              }
           ]
        }],{});
        await executionContext.hostControl.resumeHistory(test);
   })
}
const LB_HIST_NAME = "LensBlur Me";
function checkedHistory(){
   const his = app.activeDocument.historyStates;
   if(his[his.length-1].name==LB_HIST_NAME)
       {
           console.log("yes");
           app.activeDocument.activeHistoryState = his[his.length-2];}
}

function createSlider(Tag,action){
   const sl_radius = document.createElement("sp-slider");
   const val_label = document.createElement("sp-label");
   val_label.setAttribute("slot","label");
   val_label.textContent = Tag;
   sl_radius.setAttribute("min",0);
   sl_radius.setAttribute("max",100);
   sl_radius.setAttribute("value",0);
   sl_radius.appendChild(val_label);


   return sl_radius;
}

async function runTasks(target) {


   try {
       await require("photoshop").core.executeAsModal(target, { "commandName": "dosomestuff", "interactive": true });
   } catch (err) {
       console.log(err);
   }




}
async function LensBlurMe(radius,grain){
   await runTasks(async (executionContext, descriptor) => {
      checkedHistory();
      let lensblur_suspensionID = await executionContext.hostControl.suspendHistory({
          "documentID": app.activeDocument.id,
          "name": LB_HIST_NAME
      })
      await BP([{
         "_obj": "$Bokh",
         "$BkDi": {
            "_enum": "$BtDi",
            "_value": "$BeIa"
         },
         "$BkDc": 0,
         "$BkDp": 0,
         "$BkDs": true,
         "$BkIs": {
            "_enum": "$BtIs",
            "_value": "$BeS6"
         },
         "$BkIb": radius,
         "$BkIc": 0,
         "$BkIr": 101,
         "$BkSb": 0,
         "$BkSt": 255,
         "$BkNa": grain,
         "$BkNt": {
            "_enum": "$BtNt",
            "_value": "$BeNu"
         },
         "$BkNm": false
      }],{});

      await executionContext.hostControl.resumeHistory(lensblur_suspensionID);
  })
}

async function buildUi(){
   while(bppanel.lastElementChild)
      bppanel.removeChild(bppanel.lastElementChild);

   const layer = await app.activeDocument.activeLayers[0];
   if(layer.kind=="smartObject"){
      await BP([{
         "_obj": "rasterizeLayer",
         "_target": [
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "targetEnum"
            }
         ]
      }],{});
   }

   const maindiv = document.createElement("div");
   bppanel.setAttribute("style","width:100%;")
   maindiv.setAttribute("style","width:100%;display:flex;flex-direction: row;justify-content: space-evenly;flex-wrap: nowrap;");
   maindiv.className = "lensblur";
   const sl_radius = createSlider("Radius");
   const sl_grain = createSlider("Grain");
   [sl_grain,sl_radius].forEach((e)=>{
      e.addEventListener("change",async (s)=>{
         try {
            await LensBlurMe(sl_radius.value,sl_grain.value);
         } catch (err) {
            console.log(err);
         }
      })
   })
  

   maindiv.appendChild(sl_radius);
   maindiv.appendChild(sl_grain);
   bppanel.appendChild(maindiv);
   await initiate();
   
}
buildUi();