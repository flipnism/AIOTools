import React, { useState, useRef, useEffect } from "react";
import { MCB } from "../components/MCB";
import "../sass/logpanel.sass"
export const LogPanel = () => {
    const [log, setLog] = useState([]);
    const [logEnable, setLogEnable] = useState(false);
    const [expand, setExpand] = useState(false);
    function appendLogUi(test) {
        if (logEnable)
            setLog([...log, { color: "", data: JSON.stringify(test, undefined, 2) }]);
    }
    window.log = appendLogUi;
    return (
        <div className="logui-panel">
            <div className="group-horizontal" style={{ justifyContent: "space-between" }}>
                <MCB onChange={e => {
                    setLogEnable(e.target.checked)
                }} value="enable log" />

                <div className="bp-button" onClick={() => { setLog([]) }}>CLEAR</div>

            </div>
            <div className="logui-content">
                {log.map((val, id) => {
                    return (<div key={id} className='log-text-parent'>
                        <div className="log-text-clear bp-button" onClick={() => {

                            navigator.clipboard.setContent({ "text/plain": val.data });
                        }}>COPY</div>
                        <sp-span class="log-tag" style={{ display: expand ? "none" : "block" }}>❱</sp-span>
                        <sp-label class="logui-text"
                            onMouseDown={() => {
                                val.color = "#232323";
                                setLog([...log])
                            }}
                            onMouseUp={() => {
                                val.color = "";
                                setLog([...log])
                            }}
                            onDoubleClick={(e) => {
                                setExpand(!expand)
                            }}

                            style={{ backgroundColor: val.color, maxHeight: expand ? "100%" : "10px" }}
                        >{val.data}</sp-label></div>)
                })}
            </div>
        </div>
    )
}