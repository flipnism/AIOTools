

export const photoshop = require("photoshop");
export const PSCoreModal = photoshop.core.executeAsModal;
export const PSBP = photoshop.action.batchPlay;
export const app = photoshop.app;
export const fs = require("uxp").storage.localFileSystem;
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));




async function DocID() {
  return app.activeDocument.id;
}

export function getMaxName(ntries) {
  const files = ntries.filter(e => e.name.indexOf('psd') > 0);
  const names = []
  files.forEach(child => {
    const name = parseInt(child.name.replace('.psd', ''));
    if (!isNaN(name))
      names.push(name);
  })
  return Math.max(...names);
}

export function findLayer(key) {
  return new Promise(async (resolve, reject) => {
    await PSCoreModal(
      async () => {
        const docRef = {
          _ref: "document",
          _id: app.activeDocument.id,
        };
        const result = await PSBP(
          [
            {
              _obj: "multiGet",
              _target: docRef,
              extendedReference: [
                ["name", "layerID"],
                {
                  _obj: "layer",
                  index: 1,
                  count: -1,
                },
              ],
            },
          ],
          {}
        );
        const textLayers = result[0].list.filter((llist) => {
          return llist.name == key;
        });
        resolve(textLayers);
      },
      { commandName: "list all layers" }
    );
  });
}
export function getLayers() {
  return new Promise(async (resolve, reject) => {
    await PSCoreModal(
      async () => {
        const docRef = {
          _ref: "document",
          _id: app.activeDocument.id,
        };
        const result = await PSBP(
          [
            {
              _obj: "multiGet",
              _target: docRef,
              extendedReference: [
                ["name", "layerID"],
                {
                  _obj: "layer",
                  index: 1,
                  count: -1,
                },
              ],
            },
          ],
          {}
        );
        // const textLayers = result[0].list.filter((llist) => {
        //   return llist.name.includes("dcsmstext");
        // });
        resolve(result[0].list);
      },
      { commandName: "list all layers" }
    );
  });
}
export async function insertTemplate(template) {
  await PSCoreModal(
    async () => {
      await PSBP(
        [
          {
            _obj: "placeEvent",
            null: {
              _path: await fs.createSessionToken(template),
              _kind: "local",
            },
            linked: true,
          },
          {
            _obj: "placedLayerConvertToLayers",
          },
        ],
        {}
      );
    },
    { commandName: "Create" }
  );
}
async function selectLayerByID(layerID) {
  //     return new Promise((res,rej)=>{
  //         function recurse(data){
  //             data.forEach(d => {
  //                 if(d.kind=="group"){
  //                     recurse(d.layers)
  //                 }else{
  //                     if(d.kind=="text" && d.id==layerID){
  //                         res(d);
  //                     }

  //                 }
  //             });
  //         }
  //         recurse(app.activeDocument.layers);
  //    })
  return new Promise(async (resolve, rej) => {
    const result = await PSBP(
      [
        {
          _obj: "select",
          _target: { _ref: "layer", _id: layerID },
        },
      ],
      {}
    );

    resolve(result);
  });
}
async function moveLayer(top, left) {
  return await PSBP(
    [
      {
        _obj: "transform",
        _target: [
          {
            _ref: "layer",
            _enum: "ordinal",
            _value: "targetEnum",
          },
        ],
        freeTransformCenterState: {
          _enum: "quadCenterState",
          _value: "QCSAverage",
        },
        offset: {
          _obj: "offset",
          horizontal: {
            _unit: "pixelsUnit",
            _value: left,
          },
          vertical: {
            _unit: "pixelsUnit",
            _value: top,
          },
        },
        interfaceIconFrameDimmed: {
          _enum: "interpolationType",
          _value: "bilinear",
        },
      },
    ],
    {}
  );
}

export async function setText(templateid, texts) {
  await PSCoreModal(
    async () => {
      try {
        await selectLayerByID(templateid);

        let oldtext;
        let ntext;
        let top = 0,
          left = 0;
        for (const [index, text] of texts.entries()) {
          if (index == 0) {
            await PSBP(
              [
                {
                  _obj: "set",
                  _target: [
                    {
                      _ref: "property",
                      _property: "textStyle",
                    },
                    {
                      _ref: "textLayer",
                      _id: templateid,
                    },
                  ],
                  to: {
                    _obj: "textStyle",
                    textOverrideFeatureName: 808465458,
                    typeStyleOperationType: 3,
                    size: {
                      _unit: "pointsUnit",
                      _value: 90,
                    },
                  },
                },
              ],
              {}
            );
            oldtext = app.activeDocument.activeLayers[0];
          }

          await app.activeDocument.activeLayers[0].duplicate();
          const ntext = app.activeDocument.activeLayers[0];
          ntext.name = "dcsmstext_tamper";
          await PSBP(
            [
              {
                _obj: "set",
                _target: [{ _ref: "layer", _id: ntext.id }],
                to: { _obj: "textLayer", textKey: text },
              },
            ],
            {}
          ).then(() => {
            let h = ntext.boundsNoEffects.bottom - ntext.boundsNoEffects.top;
            top = index == 0 ? -ntext.boundsNoEffects.top : h;

            moveLayer(top, -ntext.boundsNoEffects.left);
          });
        }

        if (oldtext) {
          oldtext.delete();
        }

      } catch (error) {
        logme(error);
      }
    },
    { commandName: "set text layer" }
  );
}

export async function selectText() {
  await PSCoreModal(
    async () => {
      getLayers().then(async (result) => {
        let initpost = { top: 10, left: 10 };
        for (const layer of result) {
          selectLayerByID(layer.layerID).then(async (l) => {
            try {
              PSCoreModal(async () => {
                await l.translate(110, 110);
              });
            } catch (error) {
              logme(error);
            }
          });
          // logme(l);
          // const top = l.boundsNoEffects.top;
          // const left = l.boundsNoEffects.left;
          // const right = l.boundsNoEffects.right;
          // const bottom = l.boundsNoEffects.bottom;
          // const h = bottom-top;
          // const _top = initpost.top - top;
        }
      });
    },
    { commandName: "select text" }
  );
}

export async function runModalTasks(target) {
  return new Promise(async (resolve, reject) => {
    await PSCoreModal(target, { commandName: "dosomestuff", interactive: true }).then(
      (r) => resolve(r)
    );
  });
}
export async function executeBPFile(interpreter, snippet) {


  await PSCoreModal(async () => {


    interpreter.import("uxp", require("uxp"));
    interpreter.import("os", require("os"));
    interpreter.run(`
            "use strict";
            
                async function userCode(){
                const photoshop = require("photoshop");
                const BP = require("photoshop").action.batchPlay;
                const app = require("photoshop").app;
                const fs = require('uxp').storage.localFileSystem;
                const websocket = new WebSocket("ws://localhost:7898/Server", "ps-protocol")
                const ps_CoreModal = photoshop.core.executeAsModal;
                const ps_Bp = photoshop.action.batchPlay;
                const ps_Fs = require("uxp").storage.localFileSystem;
                ${snippet}
            };
            exports.returnValue = userCode();
            `);


  }).catch((e) => logme(e));;

}
window.executeBP = executeBPFile;
export async function saveDocument(filename, channel) {
  await PSCoreModal(async () => {

  }, { commandName: "save document" })
}
export async function collapseAll() {
  photoshop.core.performMenuCommand({ commandID: 2965 });

}
export async function createNewDoc() {
  await runModalTasks(async () => {
    try {
      const result = await PSBP(
        [
          {
            _obj: "make",
            new: {
              _obj: "document",
              artboard: false,
              autoPromoteBackgroundLayer: false,
              preset: "Thumbnail",
            },
          },
        ],
        {}
      );
    } catch (error) {
      logme(error);
    }
  });
}

export function no_getTagLayers() {
  let grouplayer = [];
  function getLayers(layer) {
    layer.forEach(lyr => {
      if (lyr.kind == "group") {
        if (lyr.name == "TAG") {
          lyr.forEach(taglayer => {
            logme(lyr.name);
            grouplayer.push(taglayer);
          })
        }

      }
      else
        getLayers(lyr)
    })

  }
  getLayers(require("photoshop").app.activeDocument.layers);
  return grouplayer;
}

export function getTagLayers() {
  let datas = [];
  function recurse(data, istag) {
    data.forEach((d) => {
      if (d.kind == "group") {
        if (d.name == "TAG") {
          recurse(d.layers, true);
        } else {
          recurse(d.layers, false);
        }
      } else {
        if (istag) {
          datas.push(d);
        }
      }
    });
  }
  recurse(require("photoshop").app.activeDocument.layers, false);

  return datas;
}
export function insertSmartObject(entryobject) {
  runModalTasks(async () => {
    try {
      const result = await PSBP(
        [
          {
            _obj: "placeEvent",
            null: {
              _path: await fs.createSessionToken(entryobject),
              _kind: "local",
            },
            linked: true,
          },
        ],
        {}
      );
    } catch (err) {
      console.error(err);
    }
  });
}
export function getNewFileName(name, allnames) { }
export async function setLayerName(name) {
  await runModalTasks(async () => {
    const result = await PSBP(
      [
        {
          _obj: "set",
          _target: [
            {
              _ref: "layer",
              _enum: "ordinal",
              _value: "targetEnum",
            },
          ],
          to: {
            _obj: "layer",
            name: name,
          },
        },
      ],
      {}
    );
  });
}

export async function exportLayerAsSmartObject(token) {
  return new Promise((resolve, reject) => {
    runModalTasks(async () => {
      const result = await PSBP(
        [
          {
            _obj: "newPlacedLayer",
          },
          {
            _obj: "placedLayerConvertToLinked",
            _target: [
              {
                _ref: "layer",
                _enum: "ordinal",
                _value: "targetEnum",
              },
            ],
            using: {
              _path: token,
              _kind: "local",
            },
          },
        ],
        {}
      );
      resolve(result[result.length - 1]);
    });
  });
}

export async function findNestedObject(entireObj, keyToFind) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind]) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}

export function selectSubject() {
  try {
    return new Promise((r, rj) => {
      runModalTasks(async () => {
        await PSBP(
          [
            {
              _obj: "autoCutout",
              sampleAllLayers: false,
            },
            {
              _obj: "select",
              _target: [
                {
                  _ref: "lassoTool",
                },
              ],
            },
          ],
          {}
        );
      }).then((e) => r("nah"));
    });
  } catch (error) {
    logme(error);
  }
}

function hex2rgb(hex) {
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}
Number.prototype.maprange = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
function GetTripleColorFillCommand(top, mid, bot, pos_a, pos_b) {
  return {
    _obj: "set",
    _target: [
      {
        _ref: "contentLayer",
        _enum: "ordinal",
        _value: "targetEnum",
      },
    ],
    to: {
      _obj: "gradientLayer",
      gradientsInterpolationMethod: {
        _enum: "gradientInterpolationMethodType",
        _value: "perceptual",
      },
      angle: {
        _unit: "angleUnit",
        _value: -90,
      },
      type: {
        _enum: "gradientType",
        _value: "linear",
      },
      scale: {
        _unit: "percentUnit",
        _value: 100,
      },
      gradient: {
        _obj: "gradientClassEvent",
        name: "Custom",
        gradientForm: {
          _enum: "gradientForm",
          _value: "customStops",
        },
        interfaceIconFrameDimmed: 0,
        colors: [
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: top[0], // 1
              grain: top[1],
              blue: top[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: 0,
            midpoint: 50,
          },
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: top[0], // 1
              grain: top[1],
              blue: top[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: pos_a - 1,
            midpoint: 50,
          },
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: mid[0], // 1
              grain: mid[1],
              blue: mid[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: pos_a,
            midpoint: 50,
          },
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: mid[0], // 1
              grain: mid[1],
              blue: mid[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: pos_b,
            midpoint: 50,
          },
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: bot[0], // 1
              grain: bot[1],
              blue: bot[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: pos_b + 1,
            midpoint: 50,
          },
        ],
        transparency: [
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 0,
            midpoint: 50,
          },
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 0,
            midpoint: 50,
          },
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 4096,
            midpoint: 50,
          },
        ],
      },
    },
  };
}
function GetColorFillCommand(top, mid, bottom, position) {
  return {
    _obj: "set",
    _target: [
      {
        _ref: "contentLayer",
        _enum: "ordinal",
        _value: "targetEnum",
      },
    ],
    to: {
      _obj: "gradientLayer",
      gradientsInterpolationMethod: {
        _enum: "gradientInterpolationMethodType",
        _value: "perceptual",
      },
      angle: {
        _unit: "angleUnit",
        _value: -90,
      },
      type: {
        _enum: "gradientType",
        _value: "linear",
      },
      scale: {
        _unit: "percentUnit",
        _value: 1,
      },
      offset: {
        _obj: "paint",
        horizontal: {
          _unit: "percentUnit",
          _value: 0,
        },
        vertical: {
          _unit: "percentUnit",
          _value: position,
        },
      },
      gradient: {
        _obj: "gradientClassEvent",
        name: "Custom",
        gradientForm: {
          _enum: "gradientForm",
          _value: "customStops",
        },
        interfaceIconFrameDimmed: 0,
        colors: [
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: top[0],
              grain: top[1],
              blue: top[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: 2048,
            midpoint: 50,
          },
          {
            _obj: "colorStop",
            color: {
              _obj: "RGBColor",
              red: bottom[0],
              grain: bottom[1],
              blue: bottom[2],
            },
            type: {
              _enum: "colorStopType",
              _value: "userStop",
            },
            location: 2048,
            midpoint: 50,
          },
        ],
        transparency: [
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 0,
            midpoint: 50,
          },
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 0,
            midpoint: 50,
          },
          {
            _obj: "transferSpec",
            opacity: {
              _unit: "percentUnit",
              _value: 100,
            },
            location: 4096,
            midpoint: 50,
          },
        ],
      },
    },
    _isCommand: true,
  };
}

function getGuideCommand(pos, docid, index) {
  return {
    _obj: "make",
    new: {
      _obj: "good",
      position: {
        _unit: "pixelsUnit",
        _value: pos,
      },
      orientation: {
        _enum: "orientation",
        _value: "horizontal",
      },
      kind: {
        _enum: "kind",
        _value: "document",
      },
      _target: [
        {
          _ref: "document",
          _id: docid,
        },
        {
          _ref: "good",
          _index: index,
        },
      ],
    },
    _target: [
      {
        _ref: "good",
      },
    ],
    guideTarget: {
      _enum: "guideTarget",
      _value: "guideTargetCanvas",
    },
  };
}
export async function createGuide(docid, _posa, _posb) {
  const posa = _posa.maprange(0, 4096, 0, 720);
  const posb = _posb.maprange(0, 4096, 0, 720);
  await runModalTasks(async () => {
    await PSBP(
      [
        {
          _obj: "clearCanvasGuides",
        },
        getGuideCommand(posa, docid, 1),
        getGuideCommand(posb, docid, 2),
      ],
      {}
    );
  });
}
export async function ApplyColor(_id, _top, _mid, _bottom, ..._position) {
  try {
    const top = hex2rgb(_top);
    const mid = hex2rgb(_mid);
    const bottom = hex2rgb(_bottom);
    const position = _position[0];
    await runModalTasks(async () => {
      await PSBP(
        [
          {
            _obj: "select",
            _target: { _ref: "layer", _id: _id },
          },
          {
            _obj: "applyLocking",
            _target: [
              {
                _ref: "layer",
                _enum: "ordinal",
                _value: "targetEnum",
              },
            ],
            layerLocking: {
              _obj: "layerLocking",
              protectAll: false,
            },
          },
        ],
        {}
      );
      const cmd = GetColorFillCommand(top, null, bottom, position);
      const cmd_triple = GetTripleColorFillCommand(
        top,
        mid,
        bottom,
        _position[0],
        _position[1]
      );
      await PSBP([cmd_triple], {}).catch((e) => logme(e));
      await PSBP(
        [
          {
            _obj: "applyLocking",
            _target: [
              {
                _ref: "layer",
                _enum: "ordinal",
                _value: "targetEnum",
              },
            ],
            layerLocking: {
              _obj: "layerLocking",
              protectAll: true,
            },
          },
        ],
        {}
      );
    }).catch((e) => logme(e));
  } catch (error) {
    logme(error);
  }
}

export async function showGuides(show, pos, docid) {
  const posa = pos.l.maprange(0, 4096, 0, 720);
  const posb = pos.r.maprange(0, 4096, 0, 720);
  logme(show, posa, posb, docid);
  await runModalTasks(async () => {
    if (show)
      await PSBP(
        [getGuideCommand(posa, docid, 1), getGuideCommand(posb, docid, 2)],
        {}
      ).catch((e) => logme(e));
    else
      await PSBP([{ _obj: "clearCanvasGuides" }], {}).catch((e) =>
        logme(e)
      );
  }).catch((e) => logme(e));
}





export async function showHideShadows(show) {
  ["shadow", "shadow2", "shadow3"].forEach(async (shadow) => {

    await runModalTasks(async () => {
      await PSBP(
        [{
          "_obj": "select",
          "_target": [
            {
              "_ref": "layer",
              "_name": shadow
            }
          ],
          "makeVisible": false
        }, {
          "_obj": show ? "show" : "hide",
          "null": [
            {
              "_ref": [
                {
                  "_ref": "layerEffects"
                },
                {
                  "_ref": "layer",
                  "_name": shadow
                }
              ]
            }
          ], "_isCommand": true
        }
        ],
        {}
      );
    }).catch((e) => logme(e));
  });
}


export async function showThumbnailTag(alltags, currenttag) {
  await PSCoreModal(() => {
    alltags.forEach(l => {
      l.visible = l.name == currenttag ? true : false;
    })
  }, { commandName: "TagLayer" });
}

export async function doSaveDocument(savepathtoken, namafile, channel) {

  return new Promise(async (resolve, reject) => {


    const newJPG = await savepathtoken.createFile(namafile + ".jpeg", { overwrite: true });
    const newPSD = await savepathtoken.createFile(namafile + ".psd", { overwrite: true });
    const saveJPEG = await fs.createSessionToken(newJPG);
    const savePSD = await fs.createSessionToken(newPSD);
    await PSCoreModal(async () => {

      const result = await PSBP([{
        "_obj": "save",
        "as": {
          "_obj": "photoshop35Format",
          "maximizeCompatibility": true
        },
        "in": {
          "_path": savePSD,
          "_kind": "local"
        },
        "documentID": app.activeDocument._id,
        "lowerCase": true,
        "saveStage": {
          "_enum": "saveStageType",
          "_value": "saveBegin"
        }
      }, {
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
      }], {}).catch(e => logme("PS", e));
      logme(result[1]);
      resolve(result[1].in._path)



    }).catch(e => logme("CORE", e))
  })
}


export async function bpSync(command, tagname) {
  return new Promise(async (resolve, reject) => {

    await PSCoreModal(async () => {
      const result = await PSBP(command, {}).catch(e => { logme(e); reject() });
      resolve(result);
    }, { commandName: tagname }).catch(e => { logme(e); reject() })
  })
}
window.bpSync = bpSync;
window.ps_Bp = PSBP;
window.ps_CoreModal = PSCoreModal;
window.ps_App = app;
window.ps_Fs = fs;
window._delay = delay;
const debug = true;
export function logme(...obj) {
  if (debug)
    console.log(...obj);
}