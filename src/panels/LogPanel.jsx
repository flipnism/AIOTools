import React, { useState, useRef, useEffect } from "react";
import { MCB } from "../components/MCB";
import "../sass/logpanel.sass"
export const LogPanel = () => {
    const socketUrl = "ws://localhost:7898/Server";
    const url = "http://localhost:3000";
    const [toggleWa, setToggleWa] = useState(true)
    const [log, setLog] = useState([]);
    const [logEnable, setLogEnable] = useState(false);
    const [expand, setExpand] = useState(false);
    let [chat, setChat] = useState([]);
    function appendLogUi(test) {
        if (logEnable)
            setLog([...log, { color: "", data: JSON.stringify(test, undefined, 2) }]);
    }
    window.log = appendLogUi;
    function setCheck(id, check) {
        fetch(`${url}/check/${id}/${check}`)
            .then(response => { if (response.ok) return response.json() })
            .then(result => {
                setChat(result);
            })
    }
    function deleteMessage(id) {
        fetch(`${url}/done/${id}`)
            .then(response => { if (response.ok) return response.json() })
            .then(result => {

                setChat(result);
            })
    }
    function deleteSelected() {
        let d = []
        for (const c of chat) {
            if (c.checked) {
                d.push(c._id);
            }
        }
        fetch(url + `/deleteselected`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(d),
        }).then(response => { if (response.ok) return response.json() })
            .then(result => {
                setChat(result);
            })
    }
    function reloadWhatsApp() {
        fetch(`${url}/todolist`)
            .then(response => { if (response.ok) return response.json() })
            .then(result => {
                setChat(result);
            })
    }
    useEffect(() => {
        fetch(`${url}/todolist`)
            .then(response => { if (response.ok) return response.json() })
            .then(result => {
                setChat(result);
            })
    }, []);
    return (<>
        <div className="switch">


            <div className="wa-btn-group">
                <div size="s" className="bp-button" onClick={reloadWhatsApp} >RELOAD</div>
                <div size="s" className="bp-button" onClick={deleteSelected}>DELETE SELECTED</div>
            </div>

        </div>
        <div className="second-panel">


            <div className="wa-panel">

                {chat.map((v, index) => {
                    return <div key={index} className="message-card">
                        <div className="cb" style={{ border: v.checked ? "solid 4px #fd0" : "solid 4px #444" }} onClick={() => {

                            setCheck(v._id, !v.checked);

                        }} />
                        <div className="message-text" onClick={() => {
                            sockSendMessage({
                                fromserver: false,
                                type: "sendtextclipboard",
                                data: v.text
                            })
                        }}>{v.text}</div>
                        <div className="message-delete" onClick={() => {
                            deleteMessage(v._id);
                        }}>𐄂</div>
                    </div>
                })}

            </div>
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
        </div>
    </>

    )
}