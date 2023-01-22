import React, { useEffect, useState } from "react";
import { PSBP, PSCoreModal, logme, photoshop } from "../modules/bp";
import { ALIGN, alignLayers, getSelectedLayers, getGroupBounds } from "../utils/layer";
import { MCB } from "./MCB";

export const StepInput = ({ title, value, curvalue, ...props }) => {
    const [val, setVal] = useState(curvalue);
    const [to, setTo] = useState(100);
    const [startLong, setStartLong] = useState(false);
    const [isup, setIsup] = useState(true);




    useEffect(() => {
        let timerId;
        value(val);
        if (startLong) {
            timerId = setInterval(() => {
                setVal(isup ? val + 1 : val - 1);
                if (val < 0) {
                    setVal(0);
                    setStartLong(false);
                    clearInterval(timerId);
                }

            }, to)
        } else {
            clearInterval(timerId);
        }
        return () => {
            clearInterval(timerId);
        }


    }, [val, to, startLong])
    return (
        <div className="si-group"
            onMouseDown={(e) => {
                if (e.button == 2)
                    e.stopPropagation();
                setIsup(e.button == 0 ? true : false)

                setStartLong(true)
            }
            }
            onMouseUp={() => setStartLong(false)}
            onMouseLeave={() => setStartLong(false)}
            onTouchStart={() => setStartLong(true)}
            onTouchEnd={() => setStartLong(false)}
        >
            <span className="si-span">{title}</span>
            <span className="si-input">{val}</span>
        </div>

    )
}

export const AlignTool = () => {
    const events = [{ event: "select" }];
    const [toCanvas, setToCanvas] = useState(false);
    const [margin, setMargin] = useState(localStorage.getItem("GAPMARGIN") == null ? 0 : parseInt(localStorage.getItem("GAPMARGIN")));
    const [isTag, setIsTag] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const alignbtn = [
        ALIGN.LEFT,
        ALIGN.CENTERHORIZONTAL,
        ALIGN.RIGHT,
        ALIGN.TOP,
        ALIGN.CENTERVERTICAL,
        ALIGN.BOTTOM];
    const docWidth = 1280;
    const docHeight = 720;



    async function OnAlignClick(alignto) {
        localStorage.setItem("GAPMARGIN", margin);
        const leftGut = isTag ? 104 : 0;
        const maxLayer = getSelectedLayers();
        const groups = getGroupBounds();

        if (!isGroup)
            await alignLayers(alignto, toCanvas);
        switch (alignto) {
            case ALIGN.TOP:
                PSCoreModal(() => {
                    if (isGroup)
                        maxLayer.translate(0, margin + (-groups.t))
                }, { commandName: "MOVE" })
                break;
            case ALIGN.BOTTOM:
                PSCoreModal(() => {
                    if (isGroup)
                        maxLayer.translate(0, (docHeight - groups.b) - margin)

                }, { commandName: "MOVE" })
                break;
            case ALIGN.CENTERHORIZONTAL:
                PSCoreModal(() => {
                    if (isGroup) {
                        const value = ((-groups.l) + ((docWidth - (groups.r - groups.l)) / 2)) + (leftGut / 2);

                        maxLayer.translate(value, 0)
                    } else {
                        maxLayer.translate(leftGut / 2, 0)
                    }

                }, { commandName: "MOVE" }).catch(e => logme(e))
                break;
            case ALIGN.CENTERVERTICAL:
                PSCoreModal(() => {
                    if (isGroup)
                        maxLayer.translate(0, (-groups.t) + ((docHeight - (groups.b - groups.t)) / 2))
                }, { commandName: "MOVE" })
                break;

            case ALIGN.LEFT:
                PSCoreModal(() => {
                    if (isGroup)
                        maxLayer.translate(-(groups.l) + (leftGut + margin), 0)
                    else {
                        if (toCanvas)
                            maxLayer.translate((-maxLayer.boundsNoEffects.left) + (leftGut + margin), 0)
                    }
                }, { commandName: "MOVE" })
                break;
            case ALIGN.RIGHT:
                PSCoreModal(() => {
                    if (isGroup)
                        maxLayer.translate((docWidth - groups.r) - margin, 0);
                    else {
                        if (toCanvas)
                            maxLayer.translate((docWidth - (maxLayer.boundsNoEffects.width + maxLayer.boundsNoEffects.left)) - margin, 0);
                    }
                }, { commandName: "MOVE" })
                break;
        }

    }




    return (
        <div className="group-horizontal">
            <div className="tool-align-left">
                {alignbtn.map((item, id) => {
                    return <sp-action-button value={item} key={id} class={"btn-icon " + item.toLowerCase()} onClick={() => OnAlignClick(item)}></sp-action-button>
                })}
            </div>
            <div className="tool-align-right">
                <div className="tool-align-group">
                    {isGroup ? <MCB disabled /> :
                        <MCB onInput={(e) => { setToCanvas(e.target.checked) }} value="toCanvas" />}
                    <MCB onInput={(e) => { setIsGroup(e.target.checked) }} value="Group" />
                    <MCB onInput={(e) => { setIsTag(e.target.checked) }} value="Tag" />

                </div>
                <div className="tool-align-group">
                    <StepInput


                        curvalue={margin} value={(e) => setMargin(e)} title="margin" />
                    <sp-action-button size="s">select layers</sp-action-button>
                </div>
            </div>
        </div>
    )
}