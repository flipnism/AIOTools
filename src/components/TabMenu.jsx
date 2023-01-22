import React, { useEffect, useRef } from "react";
import { LayerEffectTool } from "../components/LayerEffectTool";
const TabMenu = (props) => {
    const { clickTabBtn, show, ...rest } = props;
    const elRef = useRef(null);
    const handleEvent = (evt) => {
        const propName = `on${evt.type[0].toUpperCase()}${evt.type.substr(1)}`;

        if (rest[propName]) {
            rest[propName].call(evt.target, evt);
        }
    }
    useEffect(() => {
        const el = elRef.current;
        const eventProps = Object.entries(rest).filter(([k, v]) => k.startsWith("on"));
        eventProps.forEach(([k, v]) => el.addEventListener(k.substring(0, 2).toLowerCase(), handleEvent));

        return () => {
            const el = elRef.current;
            const eventProps = Object.entries(rest).filter(([k, v]) => k.startsWith("on"));
            eventProps.forEach(([k, v]) => el.removeEventListener(k.substring(0, 2).toLowerCase(), handleEvent));
        }
    }, []);
    return (

        <div ref={elRef} {...rest} className="tab-menu">
            <div className="tab-content">
                <sp-action-button onClick={() => clickTabBtn("save")} class="tab-btn save"></sp-action-button>
                <sp-action-button onClick={() => clickTabBtn("newdoc")} class="tab-btn newdoc"></sp-action-button>
                <sp-action-button onMouseEnter={() => clickTabBtn("bp")} class="tab-btn bp"></sp-action-button>
            </div>

            <LayerEffectTool />
            <div className="tab-child">{props.children}</div>
        </div >

    )
}
export default TabMenu;