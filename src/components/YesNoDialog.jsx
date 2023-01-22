import React, { useEffect,useState } from "react";

class YesNoDialog extends React.Component {
    
    constructor(props){
        super(props);
       


    }
    
   
 render(){

    return (
        <div className="dialog-main" style={{display:(this.props.show?"block":"none")}}>
            <form>
                <sp-heading>{this.props.title}</sp-heading>
                <sp-divider></sp-divider>
                <sp-body>{this.props.content}</sp-body>
                <footer>
                    <sp-action-button onClick={()=>{this.props.OnButtonClick(true);}}>{this.props.OkButton}</sp-action-button>
                    <sp-action-button onClick={()=>{this.props.OnButtonClick(false);}}>{this.props.CancelButton}</sp-action-button>
                </footer>
            </form>
        </div>
    )
 }
}
export default YesNoDialog;
