import React, { useEffect, useState } from "react";
import { Token, TOKEN } from "./../modules/Token";
import { logme } from "../modules/bp";
import { wrapWc } from 'wc-react';
const SpMenu = wrapWc("sp-menu");
export class ThumbnailTemplate extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            template_files: [],
            selectedindex: parseInt(localStorage.getItem("TEMPLATE INDEX"))
        }
        this.handleSelection = this.handleSelection.bind(this);
        this.getTokenEntry = this.getTokenEntry.bind(this);


        this.props.token.getToken(TOKEN.TEMPLATE)
            .then(async (result) => {
                await result.getEntries().then((entry) => {
                    const files = entry.filter((e) => {
                        return e.isFile;
                    });
                    this.setState({ template_files: files })

                    if (this.state.selectedindex > -1)
                        this.getTokenEntry(TOKEN.TEMPLATE, this.state.template_files[parseInt(this.state.selectedindex)].name);

                });
            })
            .catch((e) => {
                logme(e);
                this.props.askForToken();
            })

    }



    getTokenEntry(key, filename) {
        this.props.token.getToken(key)
            .then(async (result) => {
                await result.getEntry(filename).then((e) => {
                    this.setState({ entry: e })
                    this.props.onTemplateSelectionChange(this.state.entry);

                });
            })
    }
    handleSelection(item) {
        logme(this.state.entry);
        localStorage.setItem("TEMPLATE INDEX", parseInt(item.target.selectedIndex))
        this.setState({ selectedindex: item.target.selectedIndex });
        this.getTokenEntry(TOKEN.TEMPLATE, this.state.template_files[parseInt(item.target.selectedIndex)].name);





    }

    render() {
        return (
            <>

                <sp-picker size="s" class="stretch w100" >
                    <SpMenu slot="options" selectedIndex={parseInt(this.state.selectedindex)} onChange={this.handleSelection}>
                        {this.state.template_files.map((file, idx) => {
                            return <sp-menu-item key={idx} value={file.name}>{file.name.replace(".psd", "").replace("template", "").toUpperCase()}</sp-menu-item>
                        })}
                    </SpMenu>

                </sp-picker>


            </>
        )
    }


}