import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "../sass/contextmenu.sass"
export const MENU = [
    "text",
    "layer tool",
    "color",
    "smart object",
    "textures",
    "image search"]
export const SECONDMENU = ["save", "new doc"]
export const ContextMenu = forwardRef(({ onMenuClicked, onSecondMenuClicked, ...props }, ref) => {

    const [showMe, setShowMe] = useState(false);
    useImperativeHandle(ref, () => ({

        doClick() {
            setShowMe(true);
        }
    }));

    function handleClick(e, which) {
        setShowMe(false);
        onMenuClicked(which)
    }

    return (
        <><div className="ghost-panel"
            onClick={(e) => {
                setShowMe(false);
                onMenuClicked(null)
            }}
            style={{ display: showMe ? "block" : "none" }}
        >

            <div className="context-menu-panel" style={{ display: showMe ? "flex" : "none", top: props.mousePos[0], left: 0 }} >
                {MENU.map((menu, index) => {
                    return (<div onClick={(e) => handleClick(e, menu)} key={index} >{menu}</div>)
                })}
            </div>
            <div className="cm-btn-group" style={{ display: showMe ? "flex" : "none", top: props.mousePos[0] + 5, left: 0 }}>

                <div className="cm-btn" onClick={onSecondMenuClicked}>{SECONDMENU[0]}</div>
                <div className="cm-btn" onClick={onSecondMenuClicked}>{SECONDMENU[1]}</div>
            </div>

        </div>
        </>
    )
});