import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { logme } from "../modules/bp";


export const TextTool = forwardRef(({ BindOnClick }, ref) => {
    const [textareaValue, setTextareaValue] = useState("hello world\rlorem fuck all that")
    const [tagMode, setTagMode] = useState([]);
    const mainbtn = ["Create", "Explode", "BoxMe", "TAG"];
    const [hideText, setHideText] = useState(true);
    const [allTexts, setAllTexts] = useState([]);
    const txtRef = useRef(null);
    useImperativeHandle(ref, () => ({
        updateText(textvalue) {
            setTextareaValue(textvalue);
        }

    }));
    function handleSpanEditClick(e) {
        setHideText(false);
        txtRef.current.focus();
    }
    useEffect(() => {
        const newtext = textareaValue.trim().split("\r").map((t, index) => { return { tag: tagMode[index] != null ? tagMode[index] : "", text: t } })
        setAllTexts(newtext);
    }, [textareaValue, tagMode])

    return (

        <div className="group-horizontal">
            <div className="stretch">
                <sp-textarea
                    ref={txtRef}
                    style={{ display: hideText ? "none" : "flex" }}
                    value={(textareaValue)}
                    onInput={(e) => { setTextareaValue(e.target.value) }}
                    class="w100 h100 flexme" onBlur={(e) => {
                        setHideText(true);
                    }} autofocus></sp-textarea>
                <div
                    onDoubleClick={handleSpanEditClick}
                    className="span-editor"
                    style={{ display: hideText ? "flex" : "none" }}>
                    {allTexts.map((txt, index) => {
                        let tag = tagMode[index];

                        return (
                            <div key={index} className="group-horizontal">


                                <span className="span-tag"
                                    onClick={() => {
                                        let newTag = tagMode;
                                        var newtagnum = tagMode[index];
                                        if (newtagnum == "@")
                                            newtagnum = "$";
                                        else if (newtagnum == "$")
                                            newtagnum = "";
                                        else
                                            newtagnum = "@";
                                        newTag[index] = newtagnum;
                                        setTagMode([...newTag]);

                                    }}
                                >{tag}</span>
                                <sp-label

                                    class={"span-editor-label"} >{txt.text}</sp-label>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="btn-group group-vertical">
                {
                    mainbtn.map((i, x) => {
                        return <sp-action-button
                            class={"btn " + i.toLowerCase().replace("\s", "-")}
                            key={x}
                            onClick={() => BindOnClick(i.toLowerCase(), allTexts)}>{i}</sp-action-button>
                    })
                }
            </div>


        </div >
    )
});