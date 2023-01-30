await BP([{
    "_obj": "rasterizeLayer",
    "_target": [
       {
          "_ref": "layer",
          "_enum": "ordinal",
          "_value": "targetEnum"
       }
    ]
 },{
   "_obj": "expand",
   "by": {
      "_unit": "pixelsUnit",
      "_value": 5
   },
   "selectionModifyEffectAtCanvasBounds": false,
},{
   "_obj": "cafWorkspace",
   "cafSamplingRegion": {
      "_enum": "cafSamplingRegion",
      "_value": "cafSamplingRegionAuto"
   },
   "cafSampleAllLayers": false,
   "cafColorAdaptationLevel": {
      "_enum": "cafColorAdaptationLevel",
      "_value": "cafColorAdaptationDefault"
   },
   "cafRotationAmount": {
      "_enum": "cafRotationAmount",
      "_value": "cafRotationAmountNone"
   },
   "cafScale": false,
   "cafMirror": false,
   "cafOutput": {
      "_enum": "cafOutput",
      "_value": "cafOutputToCurrentLayer"
   }
}],{});