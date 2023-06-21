try {


    const BlurPanel = new EL(false);
    const BP_ROOT = BlurPanel.mainparent(false, "blur-panel")
    const BP_GROUP = BlurPanel.makegroup(true)
    const BP_GROUP2 = BlurPanel.makegroup(true)

    const gaussianBlur = (value) => {
        return {
            "_obj": "gaussianBlur",
            "radius": {
                "_unit": "pixelsUnit",
                "_value": value
            }
        }
    }
    const unsharpMask = (amout, radius, threshold) => {
        return {
            "_obj": "unsharpMask",
            "amount": {
                "_unit": "percentUnit",
                "_value": amout
            },
            "radius": {
                "_unit": "pixelsUnit",
                "_value": radius
            },
            "threshold": threshold
        }
    }
    const denoise = (strenght, preserveDetail, colorNoise, sharpen) => {
        return {
            "_obj": "denoise",
            "colorNoise": {
                "_unit": "percentUnit",
                "_value": colorNoise
            },
            "sharpen": {
                "_unit": "percentUnit",
                "_value": sharpen
            },
            "removeJPEGArtifact": true,
            "channelDenoise": [
                {
                    "_obj": "channelDenoiseParams",
                    "channel": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "composite"
                    },
                    "amount": strenght,
                    "edgeFidelity": preserveDetail
                },
                {
                    "_obj": "channelDenoiseParams",
                    "channel": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "red"
                    },
                    "amount": 0
                },
                {
                    "_obj": "channelDenoiseParams",
                    "channel": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "grain"
                    },
                    "amount": 0
                },
                {
                    "_obj": "channelDenoiseParams",
                    "channel": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "blue"
                    },
                    "amount": 0
                }
            ],
            "preset": "Default"
        }
    }



    const _sliders = [
        { id: 0, name: "💨 gaussian", min: 0.1, max: 20, value: 0, step: 0.01 },
        { id: 1, name: "✂ strength", min: 0, max: 10, value: 0, step: 1 },
        { id: 2, name: "✂ preserveDetail", min: 0, max: 100, value: 0, step: 1 },
        { id: 3, name: "✂ colorNoise", min: 0, max: 100, value: 0, step: 1 },
        { id: 4, name: "✂ sharpen", min: 0, max: 100, value: 0, step: 1 },
        { id: 5, name: "🔪 amount", min: 1, max: 100, value: 0, step: 0.1 },
        { id: 6, name: "🔪 radius", min: 0.1, max: 100, value: 0, step: 0.1 },
        { id: 7, name: "🔪 threshold", min: 0, max: 255, value: 0, step: 1 },
    ]
    /* 
    "gaussianBlur"
    "denoise"
    
    */
    function applyUnsharpMask(firstTime, index) {
        const command = unsharpMask(_sliders[5].value, _sliders[6].value, _sliders[7].value);
        if (firstTime) {
            return command;
        } else {
            return setFilter(index, command)

        }
    }
    function applyGaussian(firstTime, index) {
        const command = gaussianBlur(_sliders[0].value);
        if (firstTime) {
            return command;
        } else {
            return setFilter(index, command)

        }
    }
    function applyDenoise(firstTime, index) {
        const command = denoise(_sliders[1].value, _sliders[2].value, _sliders[3].value, _sliders[4].value);
        if (firstTime) {
            return command;
        } else {
            return setFilter(index, command)

        }
    }
    async function onSliderChanged(e) {
        const sl_index = _sliders.findIndex(ex => ex.name.toUpperCase() == e.target.dataset.name.toUpperCase());
        _sliders[sl_index].value = e.target.value;
        try {
            const _is = await isApplied(app.activeDocument.activeLayers[0].id);

            let command = [];
            if (_is[0] == true) {
                const check = _is[1].filter(e => { return e.filter._obj == "denoise" })

                if (check.length > 0) {
                    for (const [i, v] of _is[1].entries()) {
                        if (v.filter._obj === "denoise") {
                            command.push(applyDenoise(false, i + 1));
                        } else if (v.filter._obj === "gaussianBlur") {
                            command.push(applyGaussian(false, i + 1));
                        } else if (v.filter._obj === "unsharpMask") {
                            command.push(applyUnsharpMask(false, i + 1));
                        }
                    }
                } else {
                    command.push(applyDenoise(true, -1));
                    command.push(applyGaussian(true, -1));
                    command.push(applyUnsharpMask(true, -1));
                }

            } else {
                command.push(applyDenoise(true, -1));
                command.push(applyGaussian(true, -1));
                command.push(applyUnsharpMask(true, -1));
            }
            await ps_CoreModal(async () => {
                await ps_Bp(command, {});
            }, { commandName: "some tag" });
        } catch (error) {
            console.log(error)
        }
    }

    _sliders.forEach((d) => {
        const ss = BlurPanel.add(C.slider, `sld_${d.id}`, d.name.toUpperCase());
        BlurPanel.style(ss, { width: "50%", flexGrow: "1", padding: "0 10px" })
        ss.addEventListener("change", onSliderChanged);
        BlurPanel.minmaxval(ss, d);
        BP_GROUP.appendChild(ss);
    });


    function onSelectLayerListener(res) {
        isApplied(res.layerID[0]).then((result) => {

            if (result[0]) {
                for (const [i, v] of result[1].entries()) {
                   
                    if (v.filter._obj == "denoise") {
                        _sliders[1].value = v.filter.channelDenoise[0].amount;
                        _sliders[2].value = v.filter.channelDenoise[0].edgeFidelity;
                        _sliders[3].value = v.filter.colorNoise._value;
                        _sliders[4].value = v.filter.sharpen._value;
                    } else if (v.filter._obj == "gaussianBlur") {
                        _sliders[0].value = v.filter.radius._value;
                    } else if (v.filter._obj == "unsharpMask") {
                        _sliders[5].value = v.filter.amount._value;
                        _sliders[6].value = v.filter.radius._value;
                        _sliders[7].value = v.filter.threshold;


                    }
                }
                _sliders.forEach((s) => {
                    document.querySelector(`.sld_${s.id}`).setAttribute("value", s.value);
                })
            } else {
                _sliders.forEach((s) => {
                    document.querySelector(`.sld_${s.id}`).setAttribute("value", 0);
                })
            }


        })
    }
    window._Emitter.off('jul:layerselect')
    window._Emitter.on('jul:layerselect', onSelectLayerListener)

    const btn_so = BlurPanel.add(C.div, C.class_btn, "CONVERT TO SMARTOBJECT");
    btn_so.addEventListener("click", async () => {
        await ps_CoreModal(async () => {
            await ps_Bp([{
                "_obj": "newPlacedLayer"
            }], {});
        }, { commandName: "Apply Smart Object" });
    })
    BlurPanel.style(BP_GROUP2, { width: "100%", marginTop: "10px", justifyContent: "center" })
    BP_GROUP2.appendChild(btn_so);
    BP_ROOT.appendChild(BP_GROUP);
    BP_ROOT.appendChild(BP_GROUP2);
    BlurPanel.attachGroup(BP_ROOT);



} catch (error) {
    log(error);
}