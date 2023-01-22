import React, { useEffect, useState } from "react";
import { logme } from "../modules/bp";
import { ADJLAYER, applyAdjustmentLayer, fitImage } from "../utils/layer";

export const LayerEffectTool = (props) => {
    const { Clicked, ...rest } = props
    const layereffect = [
        "curve",
        "huesat",
        "exposure",
        "colorbalance",
        "fitimage",
        "gradientmap",
        "colorlookup"]

    async function OnLayerEffectClick(par) {

        switch (par) {
            case "curve":
                applyAdjustmentLayer(ADJLAYER.CURVES);
                break;
            case "huesat":
                applyAdjustmentLayer(ADJLAYER.HUESATURATION);

                break;
            case "exposure":
                applyAdjustmentLayer(ADJLAYER.EXPOSURE);

                break;
            case "colorbalance":
                applyAdjustmentLayer(ADJLAYER.COLORBALANCE);

                break;
            case "fitimage":
                await fitImage(true);
                break;
            case "gradientmap":
                applyAdjustmentLayer(ADJLAYER.GRADIENTMAP);

                break;
            case "colorlookup":
                applyAdjustmentLayer(ADJLAYER.LUT);

                break;
        }
    }
    return (
        <div className="tool-layereffect" {...rest}>
            {layereffect.map((item, id) => {
                return <sp-action-button key={id} class={"btn-icon " + item} onClick={() => OnLayerEffectClick(item)}></sp-action-button>
            })}


        </div>
    )
}