import React, { useState, useEffect } from 'react'
import '../sass/buttonlist.sass'

export const btnLists = [
    "text",
    "color",
    "smart object",
    "textures",
    "image search"]
export const btnMain = [
    "save", "newdoc", "collapse"
]
export const ButtonList = ({ onButtonItemClick, onButtonItemMainClick }) => {
    const [btnState, setBtnState] = useState(false)
    const [isHover, setIsHover] = useState(false);


    useEffect(() => {
        let timer = setTimeout(() => setBtnState(isHover), 100);
        return () => {
            clearTimeout(timer);
        };

    }, [isHover])
    return (

        <div className="btnlist-group"
            onMouseOut={() => setIsHover(false)}
            onMouseOver={() => setIsHover(true)}
        >
            {btnState ? (<>
                <div className="btnlist-group-main">
                    {btnMain && btnMain.map((item, index) => {
                        return <div key={index}
                            onClick={() => { onButtonItemMainClick(item) }}
                            size="s"
                            className="btnlist-main" >{item.toUpperCase()}</div>
                    })}
                </div>
                <div size="s" className="btnlist" onClick={() => { onButtonItemClick("☢") }} style={{ textAlign: "center", fontSize: ".8rem" }}>☢</div>

                {btnLists.map((value, index) => {
                    return <div key={index}
                        onClick={() => { onButtonItemClick(value) }}
                        size="s"
                        className="btnlist" >{value.toUpperCase()}</div>
                })}

            </>) : (<>  <div size="s" className="btnlist" onClick={() => { onButtonItemClick("☢") }} style={{ textAlign: "center", fontSize: "1.5rem" }}>☢</div>
            </>)}

        </div>
    )

}
