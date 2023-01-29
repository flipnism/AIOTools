 import React, { Component } from 'react'
import "../sass/textarea.sass"
export const TextArea = (props) => {

    return (
        <textarea className="custom-textarea" {...props}></textarea>
    )

}
