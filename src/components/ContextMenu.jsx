import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "../sass/contextmenu.sass"
export const MENU = [
    "text",
    "color",
    "smart object",
    "textures",
    "image search",
    "batchplay"]
export const SECONDMENU = ["save", "new doc"]
export const ContextMenu = forwardRef(({ onMenuClicked, onSecondMenuClicked, ...props }, ref) => {

    const [showMe, setShowMe] = useState(true);
    useImperativeHandle(ref, () => ({

        doClick() {
            setShowMe(true);
        },
        doHide() {
            setShowMe(false);
        }
    }));

    function handleClick(e, which) {
        setShowMe(false);
        onMenuClicked(which)
    }

    return (
        <><div className="ghost-panel"
            onClick={(e) => {
                //setShowMe(false);
                //onMenuClicked(null)
            }}
            style={{ display: showMe ? "flex" : "none" }}>
            <div className="layer-effects-panel">{props.children}</div>
            {/* <div className="context-menu-panel" style={{ display: showMe ? "flex" : "none", top: props.mousePos[0], left: 0 }} >
                {MENU.map((menu, index) => {
                    return (<div onClick={(e) => handleClick(e, menu)} key={index} >{menu.toUpperCase()}</div>)
                })}
            </div> */}


        </div>
        </>
    )
});