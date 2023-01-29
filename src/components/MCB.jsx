import React from "react"
import "../sass/mcb.sass"

export const MCB = (props) => {
    return (
        <div className="cb-container">
            <input {...props} type="checkbox" className="cb-check" />
            <span className="cb-label">{props.value}</span>
        </div>
    )
}
window.mcb = MCB;